"""Performance benchmark tests for the NijaSpec backend API.

These tests measure:
1. API response times for key endpoints
2. Database query performance
3. Concurrent user handling under load
"""

import os
import sys
import pytest
import time
import asyncio
import statistics
from httpx import AsyncClient, ASGITransport
from sqlalchemy import text

# Ensure nija-backend is in sys.path so `import main` resolves to the correct
# main.py (there is an old stub at the repo root that shadows it).
_nija_backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _nija_backend_dir not in sys.path:
    sys.path.insert(0, _nija_backend_dir)

from main import app
from app.core.database import engine, Base
from app.core.security import create_access_token
from app.middleware.rate_limit import limiter


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture
async def async_client():
    """Provide an httpx AsyncClient wired to the FastAPI app via ASGITransport.

    Creates all database tables once before yielding and drops them after.
    """
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture(autouse=True)
def reset_rate_limiter():
    """Clear the global rate limiter before each test so benchmarks are not
    throttled by the per-minute request caps defined in the middleware."""
    limiter.requests.clear()
    yield
    limiter.requests.clear()


# ---------------------------------------------------------------------------
# 1. API Response Time Benchmarks
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_api_response_times(async_client):
    """Benchmark API response times for key endpoints.

    Runs each endpoint multiple times and records mean, median, and p95 latencies.
    """
    token = create_access_token({"sub": "user@example.com", "role": "admin"})
    auth_header = {"Authorization": f"Bearer {token}"}

    endpoints = [
        ("/api/v1/auth/me", "GET"),
        ("/api/v1/orgs", "GET"),
        ("/health", "GET"),
        ("/", "GET"),
    ]

    iterations = 50
    results = {}

    for endpoint, method in endpoints:
        latencies = []
        for i in range(iterations):
            start_time = time.perf_counter()
            if method == "GET":
                resp = await async_client.get(endpoint, headers=auth_header)
            end_time = time.perf_counter()

            if resp.status_code < 400:
                latencies.append(end_time - start_time)
            elif i == 0:
                print(f"  [WARN] {endpoint} returned {resp.status_code}: {resp.text[:120]}")

            # Reset rate limiter periodically during long benchmark loops
            if i % 10 == 0 and i > 0:
                limiter.requests.clear()

        if latencies:
            results[endpoint] = {
                "mean": statistics.mean(latencies),
                "median": statistics.median(latencies),
                "p95": statistics.quantiles(latencies, n=20)[18],
                "min": min(latencies),
                "max": max(latencies),
                "count": len(latencies),
            }

    print("\n--- API Response Time Benchmarks ---")
    print(f"{'Endpoint':<35} {'Mean':>8} {'Median':>8} {'P95':>8} {'Min':>8} {'Max':>8}")
    print("-" * 83)
    for endpoint, stats in results.items():
        print(
            f"{endpoint:<35} "
            f"{stats['mean']:.4f}s "
            f"{stats['median']:.4f}s "
            f"{stats['p95']:.4f}s "
            f"{stats['min']:.4f}s "
            f"{stats['max']:.4f}s"
        )

    assert len(results) == len(endpoints), (
        f"Some endpoints returned errors. "
        f"Got {len(results)}/{len(endpoints)} successful endpoints."
    )

    for endpoint, stats in results.items():
        assert stats["mean"] < 0.5, (
            f"Endpoint {endpoint} is too slow: mean {stats['mean']:.4f}s"
        )


# ---------------------------------------------------------------------------
# 2. Database Query Performance
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_database_performance():
    """Benchmark raw database query performance.

    Measures latency of simple SELECT queries against the in-memory SQLite DB.
    """
    iterations = 100
    latencies = []

    async with engine.begin() as conn:
        for _ in range(iterations):
            start_time = time.perf_counter()
            await conn.execute(text("SELECT 1"))
            end_time = time.perf_counter()
            latencies.append(end_time - start_time)

    mean_latency = statistics.mean(latencies)
    median_latency = statistics.median(latencies)
    p95_latency = statistics.quantiles(latencies, n=20)[18]

    print(f"\n--- DB Query Performance ---")
    print(f"SELECT 1 x{iterations}: Mean={mean_latency:.4f}s  Median={median_latency:.4f}s  P95={p95_latency:.4f}s")

    assert mean_latency < 0.01, (
        f"DB query is too slow: mean {mean_latency:.4f}s (threshold 0.01s)"
    )


# ---------------------------------------------------------------------------
# 3. Concurrent User Handling
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_concurrent_user_handling(async_client):
    """Benchmark concurrent user handling using asyncio.gather.

    Fires many simultaneous requests at a single endpoint and verifies that
    all succeed and average latency stays within bounds.
    """
    token = create_access_token({"sub": "user@example.com", "role": "admin"})
    auth_header = {"Authorization": f"Bearer {token}"}
    endpoint = "/health"
    concurrent_requests = 20

    async def make_request():
        start_time = time.perf_counter()
        resp = await async_client.get(endpoint, headers=auth_header)
        end_time = time.perf_counter()
        return end_time - start_time, resp.status_code

    start_bench = time.perf_counter()
    tasks = [make_request() for _ in range(concurrent_requests)]
    results = await asyncio.gather(*tasks)
    end_bench = time.perf_counter()

    latencies = [res[0] for res in results if res[1] == 200]
    statuses = [res[1] for res in results]
    total_time = end_bench - start_bench

    from collections import Counter
    status_counts = Counter(statuses)

    print(f"\n--- Concurrent User Handling ---")
    print(f"Concurrent requests: {concurrent_requests}")
    print(f"Total wall-clock time: {total_time:.4f}s")
    print(f"Status distribution: {dict(status_counts)}")
    if latencies:
        print(f"Average latency under load: {statistics.mean(latencies):.4f}s")
        print(f"Throughput: {concurrent_requests / total_time:.2f} req/s")

    assert len(latencies) == concurrent_requests, (
        f"Some requests failed under load. "
        f"Successful: {len(latencies)}/{concurrent_requests}. "
        f"Statuses: {dict(status_counts)}"
    )
    assert statistics.mean(latencies) < 1.0, (
        f"Average latency under load is too high: {statistics.mean(latencies):.4f}s"
    )

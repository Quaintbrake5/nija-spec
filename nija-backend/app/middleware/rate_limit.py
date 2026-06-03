import time
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from collections import defaultdict
from typing import Dict, Tuple

# Configuration for rate limits: (requests, window_seconds)
RATE_LIMITS = {
    "auth": (5, 60),          # 5 requests per minute
    "standard": (60, 60),     # 60 requests per minute
    "default": (100, 60),     # 100 requests per minute
}

# Mapping of path prefixes to categories
PATH_CATEGORIES = {
    "/api/v1/auth": "auth",
    "/api/v1/specs": "standard",
    "/api/v1/projects": "standard",
    "/api/v1/runs": "standard",
    "/api/v1/organizations": "standard",
}

class RateLimiter:
    def __init__(self):
        # stores request timestamps for each (identifier, category)
        # { (identifier, category): [timestamp1, timestamp2, ...] }
        self.requests: Dict[Tuple[str, str], list] = defaultdict(list)

    def is_allowed(self, identifier: str, category: str) -> Tuple[bool, int]:
        now = time.time()
        limit, window = RATE_LIMITS.get(category, RATE_LIMITS["default"])

        # Clean up old requests outside the window
        self.requests[(identifier, category)] = [
            ts for ts in self.requests[(identifier, category)]
            if now - ts < window
        ]

        if len(self.requests[(identifier, category)]) < limit:
            self.requests[(identifier, category)].append(now)
            return True, limit - len(self.requests[(identifier, category)])

        return False, 0

# Global rate limiter instance
limiter = RateLimiter()

class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # 1. Identify the client
        # Priority: API Key > Client IP
        api_key = request.headers.get("X-API-Key")
        client_ip = request.client.host if request.client else "unknown"

        identifier = api_key if api_key else client_ip

        # 2. Determine endpoint category
        path = request.url.path
        category = "default"
        for prefix, cat in PATH_CATEGORIES.items():
            if path.startswith(prefix):
                category = cat
                break

        # 3. Check rate limit
        allowed, remaining = limiter.is_allowed(identifier, category)

        if not allowed:
            return JSONResponse(
                status_code=429,
                content={
                    "detail": "Too many requests",
                    "category": category,
                    "retry_after": RATE_LIMITS.get(category, RATE_LIMITS["default"])[1]
                }
            )

        # 4. Process request and add rate limit headers to response
        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(RATE_LIMITS.get(category, RATE_LIMITS["default"])[0])
        response.headers["X-RateLimit-Remaining"] = str(remaining)

        return response

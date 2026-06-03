from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.config import settings

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Middleware to add security headers to all responses.
    """
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        # X-Content-Type-Options: prevents the browser from interpreting files as a different MIME type
        response.headers["X-Content-Type-Options"] = "nosniff"

        # X-Frame-Options: prevents the page from being put in an iframe (prevents clickjacking)
        response.headers["X-Frame-Options"] = "DENY"

        # Referrer-Policy: controls how much referrer information is passed during navigation
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # X-XSS-Protection: enables the browser's XSS filter (though mostly deprecated)
        response.headers["X-XSS-Protection"] = "1; mode=block"

        # Permissions-Policy: restricts browser features
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"

        # HSTS (Strict-Transport-Security): forces HTTPS connections
        if settings.APP_ENV == "production":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"

        # Content-Security-Policy (CSP): restricts the resources that can be loaded
        # For an API, we use a very restrictive policy.
        csp_policy = "default-src 'none'; frame-ancestors 'none'; sandbox;"
        response.headers["Content-Security-Policy"] = csp_policy

        return response

def setup_security_middleware(app: FastAPI):
    """
    Configure all security-related middleware for the FastAPI application.
    """
    # 1. Custom Security Headers Middleware
    app.add_middleware(SecurityHeadersMiddleware)

    # 2. CORS Middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

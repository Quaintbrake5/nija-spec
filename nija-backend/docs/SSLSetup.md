# SSL/TLS Configuration and HTTPS Setup Guidelines

This document provides comprehensive guidelines for securing the NijaSpec backend with SSL/TLS and configuring HTTPS.

## 1. SSL/TLS Overview

Ensuring that all traffic between the client (frontend) and the backend is encrypted is critical for protecting sensitive data and maintaining compliance with security standards (e.g., NDPA, CBN).

## 2. Certificate Management

### 2.1 Production Environment (Let's Encrypt)
For production, use **Let's Encrypt** via `certbot` for free, automated, and trusted certificates.

**Installation & Setup:**
```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Generate and install certificate
sudo certbot --nginx -d api.nijaspec.com
```

**Auto-Renewal:**
Certbot typically adds a cron job or systemd timer. Verify it with:
```bash
sudo certbot renew --dry-run
```

### 2.2 Development/Staging Environment (Self-Signed)
For local development where a public domain is not available:

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nija-backend/certs/selfsigned.key \
  -out nija-backend/certs/selfsigned.crt
```
*Note: Browsers will show a warning for self-signed certificates. This is expected in dev.*

## 3. HTTPS Setup (Nginx Reverse Proxy)

It is highly recommended to use Nginx as a reverse proxy to handle SSL termination rather than configuring SSL directly in Uvicorn/Gunicorn.

### Nginx Configuration Example
```nginx
server {
    listen 80;
    server_name api.nijaspec.com;
    
    # Redirect all HTTP traffic to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.nijaspec.com;

    ssl_certificate /etc/letsencrypt/live/api.nijaspec.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.nijaspec.com/privkey.pem;

    # Modern SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 4. Security Headers

To prevent common attacks like XSS, Clickjacking, and MIME-sniffing, the following headers should be implemented.

### Recommended Headers
| Header | Recommended Value | Purpose |
| :--- | :--- | :--- |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Enforces HTTPS (HSTS) |
| `Content-Security-Policy` | `default-src 'self';` | Prevents XSS and data injection |
| `X-Frame-Options` | `DENY` or `SAMEORIGIN` | Prevents Clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Controls referrer information |

### Implementation in FastAPI
You can use the `fastapi.middleware.cors` or a custom middleware to add these headers:

```python
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

app = FastAPI()

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        return response

app.add_middleware(SecurityHeadersMiddleware)
```

## 5. Verification and Testing

After setup, verify the configuration using the following tools:

1. **SSL Labs (Qualys):** Test your public URL at [ssllabs.com](https://www.ssllabs.com/ssltest/) to get a security grade (Aim for A+).
2. **SecurityHeaders.com:** Check the implementation of your security headers at [securityheaders.com](https://securityheaders.com/).
3. **Curl Test:**
   ```bash
   curl -I https://api.nijaspec.com
   ```
   Ensure the `HTTP/2 200` status and the presence of the configured security headers.

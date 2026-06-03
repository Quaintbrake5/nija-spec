try:
    from prometheus_fastapi_instrumentator import Instrumentator
except ImportError:
    Instrumentator = None

def setup_metrics(app):
    """
    Configure Prometheus metrics collection for the FastAPI application.
    """
    if Instrumentator is not None:
        Instrumentator().instrument(app).expose(app)

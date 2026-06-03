from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Run(Base):
    __tablename__ = "runs"

    id = Column(Integer, primary_key=True, index=True)
    specification_id = Column(Integer, ForeignKey("specs.id"), nullable=False)
    status = Column(String, default="pending", nullable=False) # pending, running, completed, failed
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    results = Column(JSON, nullable=True)
    prompt_version = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    specification = relationship("Specification", back_populates="runs")
    patches = relationship("Patch", back_populates="run")

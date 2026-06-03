from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
from app.schemas.patch import PatchStatus
import enum

class Patch(Base):
    __tablename__ = "patches"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    run_id = Column(Integer, ForeignKey("runs.id"), nullable=True)
    breach_id = Column(String, index=True, nullable=False)
    file_path = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    description = Column(String, nullable=True)
    status = Column(SQLEnum(PatchStatus), default=PatchStatus.PENDING, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    # Relationships
    run = relationship("Run", back_populates="patches")

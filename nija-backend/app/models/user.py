from sqlalchemy import Column, String, DateTime, Boolean, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
import uuid
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)

    # Auth fields
    password_hash = Column(String, nullable=True)
    google_id = Column(String, unique=True, index=True, nullable=True)

    # Magic Link fields
    magic_token = Column(String, nullable=True, index=True)
    magic_token_expires_at = Column(DateTime(timezone=True), nullable=True)

    # Organization link
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)

    # Metadata
    role = Column(String, default="member")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    # Relationships
    organization = relationship("Organization", back_populates="users", foreign_keys=[organization_id])
    owned_organizations = relationship("Organization", foreign_keys="[Organization.owner_id]", back_populates="owner")

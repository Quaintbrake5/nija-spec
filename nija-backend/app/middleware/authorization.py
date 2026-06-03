from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Type, Any
from app.core.database import get_db
from app.services.auth import AuthService
from app.models.user import User
from app.models.organization import Organization

# Security scheme for JWT tokens
security = HTTPBearer()

async def get_current_user(
    auth: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    Dependency that validates the JWT token and returns the current user.
    """
    auth_service = AuthService(db)
    user = await auth_service.validate_session(auth.credentials)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

class RoleChecker:
    """
    Dependency for Role-Based Access Control (RBAC).
    """
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    async def __call__(self, current_user: User = Depends(get_current_user)) -> User:
        # Organization owner is always treated as an admin
        # In a real system, we'd check a separate membership table,
        # but here we check if the user's id matches any organization they own.
        # For simplicity, we can assume 'admin' role is mapped to the owner.

        # Check if user has one of the allowed roles
        if current_user.role not in self.allowed_roles:
            # We should also check if they are an organization owner (which implies admin)
            # However, User model doesn't easily know if they are 'an' owner without querying.
            # Let's stick to the role column for now, and we can implement owner check in ResourceOwnershipChecker.
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role {current_user.role} does not have access to this resource"
            )
        return current_user

async def validate_org_access(
    org_id: int,
    current_user: User = Depends(get_current_user)
):
    """
    Ensures the user belongs to the organization they are trying to access.
    Prevents cross-tenant access.
    """
    if current_user.organization_id != org_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this organization"
        )
    return org_id

async def validate_resource_ownership(
    resource_id: int,
    resource_model: Type[Any],
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Generic function to validate that a resource belongs to the user's organization.
    Note: This is a helper function, not a direct FastAPI dependency
    because it requires the resource_model as an argument.
    """
    from sqlalchemy.future import select

    # Fetch the resource
    result = await db.execute(select(resource_model).where(resource_model.id == resource_id))
    resource = result.scalar_one_or_none()

    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{resource_model.__name__} not found"
        )

    # Cross-tenant access prevention: check if resource belongs to user's org
    # We assume resource_model has an 'organization_id' field
    if hasattr(resource, 'organization_id'):
        if resource.organization_id != current_user.organization_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have access to this resource"
            )
    else:
        # If the resource doesn't have organization_id, it might be owned by a user
        if hasattr(resource, 'owner_id'):
            if resource.owner_id != current_user.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You are not the owner of this resource"
                )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Resource ownership cannot be validated"
            )

    return resource

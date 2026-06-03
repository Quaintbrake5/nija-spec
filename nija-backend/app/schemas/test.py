from enum import Enum
from uuid import UUID
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class Language(str, Enum):
    PYTHON = "python"
    TYPESCRIPT = "typescript"
    JAVASCRIPT = "javascript"
    JAVA = "java"
    GO = "go"
    RUST = "rust"

class TestBase(BaseModel):
    name: str = Field(..., description="The name of the test case")
    language: Language = Field(..., description="The programming language used for the test")
    code: str = Field(..., description="The actual test code")

class TestCreate(TestBase):
    spec_id: UUID = Field(..., description="The ID of the specification this test is associated with")

class TestResponse(TestBase):
    id: UUID
    spec_id: UUID
    created_at: datetime
    updated_at: datetime

class TestResults(BaseModel):
    test_id: UUID
    passed: bool = Field(..., description="Whether the test passed or failed")
    duration: float = Field(..., description="Execution time in seconds")
    logs: Optional[str] = Field(None, description="Standard output/error logs from the test execution")
    error: Optional[str] = Field(None, description="Error message if the test failed to execute")
    executed_at: datetime = Field(default_factory=datetime.utcnow)

class TestList(BaseModel):
    tests: List[TestResponse]
    total: int = Field(..., description="Total number of tests available")

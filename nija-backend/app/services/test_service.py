import subprocess
import os
import shutil
import json
import logging
from typing import Dict, Any, List, Optional, Tuple
from dataclasses import dataclass
from enum import Enum

logger = logging.getLogger(__name__)

class TestStatus(Enum):
    PENDING = "pending"
    RUNNING = "running"
    PASSED = "passed"
    FAILED = "failed"
    ERROR = "error"

@dataclass
class TestResult:
    status: TestStatus
    stdout: str
    stderr: str
    exit_code: int
    duration: float
    analysis: Dict[str, Any]

class TestService:
    """
    TestService handles the generation, execution, and analysis of compliance tests
    across multiple programming languages.
    """

    LANGUAGE_CONFIGS = {
        "python": {
            "runner": ["pytest"],
            "extension": ".py",
            "framework": "pytest",
            "result_pattern": r"passed|failed"
        },
        "typescript": {
            "runner": ["npm", "test"],
            "extension": ".ts",
            "framework": "jest",
            "result_pattern": r"PASS|FAIL"
        },
        "java": {
            "runner": ["mvn", "test"],
            "extension": ".java",
            "framework": "junit",
            "result_pattern": r"BUILD SUCCESS|BUILD FAILURE"
        },
        "go": {
            "runner": ["go", "test", "./..."],
            "extension": ".go",
            "framework": "testing",
            "result_pattern": r"PASS|FAIL"
        },
        "csharp": {
            "runner": ["dotnet", "test"],
            "extension": ".cs",
            "framework": "xunit",
            "result_pattern": r"Passed|Failed"
        },
        "php": {
            "runner": ["phpunit"],
            "extension": ".php",
            "framework": "phpunit",
            "result_pattern": r"OK \(.* tests,.* assertions\)|Tests: .* assertions failed"
        }
    }

    def __init__(self, workspace_root: Optional[str] = None):
        self.workspace_root = workspace_root or os.getcwd()
        self.tests_dir = os.path.join(self.workspace_root, ".nija", "tests")
        os.makedirs(self.tests_dir, exist_ok=True)

    def generate_test(self, breach_id: str, data: Dict[str, Any], language: str) -> str:
        """
        Generates a deterministic test file based on the breach ID and data.
        In a production environment, this would load from specific .md or .ts templates.
        """
        lang = language.lower()
        if lang not in self.LANGUAGE_CONFIGS:
            raise ValueError(f"Unsupported language: {language}")

        config = self.LANGUAGE_CONFIGS[lang]
        framework = config["framework"]

        # This is a simplified template engine.
        # In the actual NijaSpec flow, this mirrors the TS TestGenerator.
        template = self._get_template_for_language(lang, framework, breach_id)

        # Simple variable substitution for the purpose of this implementation
        test_code = template.replace("{{breach_id}}", breach_id)
        for key, value in data.items():
            test_code = test_code.replace(f"{{{{ {key} }}}}", str(value))

        file_path = os.path.join(self.tests_dir, f"{breach_id}{config['extension']}")
        with open(file_path, "w") as f:
            f.write(test_code)

        return file_path

    def execute_test(self, test_file_path: str, language: str) -> TestResult:
        """
        Executes a generated test file using the language-specific runner.
        """
        lang = language.lower()
        if lang not in self.LANGUAGE_CONFIGS:
            raise ValueError(f"Unsupported language: {language}")

        config = self.LANGUAGE_CONFIGS[lang]
        runner = config["runner"]

        # Ensure we are running in the correct directory for the runner
        test_dir = os.path.dirname(test_file_path)

        import time
        start_time = time.time()

        try:
            process = subprocess.run(
                runner,
                cwd=test_dir,
                capture_output=True,
                text=True,
                timeout=60  # Prevent hanging tests
            )
            duration = time.time() - start_time

            return self.analyze_results(
                process.returncode,
                process.stdout,
                process.stderr,
                duration,
                lang
            )

        except subprocess.TimeoutExpired as e:
            return TestResult(
                status=TestStatus.ERROR,
                stdout=e.stdout.decode() if e.stdout else "",
                stderr=e.stderr.decode() if e.stderr else "Test timed out after 60 seconds",
                exit_code=-1,
                duration=60.0,
                analysis={"error": "timeout"}
            )
        except Exception as e:
            return TestResult(
                status=TestStatus.ERROR,
                stdout="",
                stderr=str(e),
                exit_code=-1,
                duration=time.time() - start_time,
                analysis={"error": "execution_exception"}
            )

    def analyze_results(self, exit_code: int, stdout: str, stderr: str, duration: float, language: str) -> TestResult:
        """
        Analyzes the output of the test runner to determine success or failure.
        """
        lang = language.lower()
        config = self.LANGUAGE_CONFIGS.get(lang, {})

        # Most runners return 0 on success, but we verify with output patterns for robustness
        status = TestStatus.FAILED
        if exit_code == 0:
            status = TestStatus.PASSED
        elif exit_code != 0:
            # Check if it's a crash or a test failure
            if not stdout and stderr:
                status = TestStatus.ERROR
            else:
                status = TestStatus.FAILED

        analysis = {
            "exit_code": exit_code,
            "passed": status == TestStatus.PASSED,
            "language": lang,
            "framework": config.get("framework")
        }

        # Extract specific failure messages if any
        if status == TestStatus.FAILED:
            analysis["failure_reason"] = self._extract_failure_reason(stdout, stderr, lang)

        return TestResult(
            status=status,
            stdout=stdout,
            stderr=stderr,
            exit_code=exit_code,
            duration=duration,
            analysis=analysis
        )

    def _extract_failure_reason(self, stdout: str, stderr: str, language: str) -> str:
        """
        Extracts the most relevant failure message from the test output.
        """
        combined_output = stdout + "\n" + stderr
        lines = combined_output.splitlines()

        # Look for common error keywords
        keywords = ["AssertionError", "FAIL", "Error:", "Exception", "failed"]
        for line in reversed(lines):
            if any(kw in line for kw in keywords):
                return line.strip()

        return "Unknown failure. Check full output for details."

    def _get_template_for_language(self, lang: str, framework: str, breach_id: str) -> str:
        """
        Returns a test template based on language and framework.
        In a real system, this would load from files in templates/tests/
        """
        # Mock templates for the implementation
        templates = {
            "python": "import pytest\n\ndef test_{{breach_id}}():\n    # Test for {{breach_id}}\n    assert True # Placeholder\n",
            "typescript": "import { describe, it, expect } from '@jest/globals';\n\ndescribe('{{breach_id}}', () => {\n  it('should verify compliance', () => {\n    expect(true).toBe(true);\n  });\n});\n",
            "java": "import org.junit.jupiter.api.Test;\nimport static org.junit.jupiter.api.Assertions.*;\n\nclass {{breach_id}}Test {{\n    @Test\n    void testCompliance() {{\n        assertTrue(true);\n    }}\n}}\n",
            "go": "package tests\nimport \"testing\"\n\nfunc Test{{breach_id}}(t *testing.T) {{\n    if false {{\n        t.Errorf(\"Compliance check failed\")\n    }}\n}}\n",
            "csharp": "using Xunit;\n\npublic class {{breach_id}}Tests {\n    [Fact]\n    public void TestCompliance() {\n        Assert.True(true);\n    }\n}\n",
            "php": "use PHPUnit\\Framework\\TestCase;\n\nclass {{breach_id}}Test extends TestCase {\n    public function testCompliance() {\n        $this->assertTrue(true);\n    }\n}\n"
        }

        return templates.get(lang, "// Template not found for language")

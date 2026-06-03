"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestGenerator = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const generators_1 = require("../generators");
class TestGenerator {
    /**
     * Deterministic integration test scaffolding.
     * Loads templates from files for syntactically-correct output.
     */
    static generateTest(breachId, data, language = 'typescript') {
        const framework = this.langFrameworkMap[language.toLowerCase()] || 'jest';
        const generator = (0, generators_1.getGenerator)(language.toLowerCase(), framework);
        if (generator) {
            return generator.generate(data, breachId);
        }
        // Fallback for typescript/javascript if generator not found but templates exist
        const defaultTemplatesDir = path_1.default.join(__dirname, '..', '..', 'templates', 'tests');
        const templatePath = path_1.default.join(defaultTemplatesDir, `${breachId}.ts`);
        if (fs_1.default.existsSync(templatePath)) {
            return fs_1.default.readFileSync(templatePath, 'utf8');
        }
        return `// Test for ${breachId}\n// Manual implementation required.`;
    }
}
exports.TestGenerator = TestGenerator;
TestGenerator.langFrameworkMap = {
    'typescript': 'jest',
    'javascript': 'jest',
    'python': 'pytest',
    'go': 'testing',
    'java': 'junit',
    'csharp': 'xunit',
    'php': 'phpunit',
};

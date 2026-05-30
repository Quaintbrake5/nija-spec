"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestGenerator = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class TestGenerator {
    /**
     * Deterministic integration test scaffolding.
     * Loads templates from files for syntactically-correct output.
     */
    static generateTest(breachId, data) {
        const templatePath = path_1.default.join(this.templatesDir, `${breachId}.ts`);
        if (fs_1.default.existsSync(templatePath)) {
            return fs_1.default.readFileSync(templatePath, 'utf8');
        }
        return `// Test for ${breachId}\n// Manual implementation required.`;
    }
}
exports.TestGenerator = TestGenerator;
TestGenerator.templatesDir = path_1.default.join(__dirname, '..', '..', 'templates', 'tests');

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatchGenerator = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class PatchGenerator {
    /**
     * Compiles corrected architecture Markdown.
     * Uses template files for deterministic remediation.
     */
    static generatePatch(breachId, data) {
        let templateFile;
        if (breachId === 'BREACH-004') {
            const residency = data.infrastructure?.data_residency;
            if (residency === 'Foreign') {
                templateFile = 'BREACH-004-foreign.md';
            }
            else if (residency === 'Hybrid') {
                templateFile = 'BREACH-004-hybrid.md';
            }
            else {
                templateFile = 'BREACH-004-default.md';
            }
        }
        else {
            templateFile = `${breachId}.md`;
        }
        const templatePath = path_1.default.join(this.templatesDir, templateFile);
        if (fs_1.default.existsSync(templatePath)) {
            let content = fs_1.default.readFileSync(templatePath, 'utf8');
            // Replace placeholders
            content = content.replace(/\{\{retentionDays\}\}/g, String(data.retentionDays || 365));
            return content;
        }
        return `## Remediation for ${breachId}\nPlease review the regulatory requirement and update the architecture spec.`;
    }
}
exports.PatchGenerator = PatchGenerator;
PatchGenerator.templatesDir = path_1.default.join(__dirname, '..', '..', 'templates', 'patches');

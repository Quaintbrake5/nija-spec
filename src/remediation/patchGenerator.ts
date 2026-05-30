import fs from 'fs';
import path from 'path';

export class PatchGenerator {
  private static templatesDir = path.join(__dirname, '..', '..', 'templates', 'patches');

  /**
   * Compiles corrected architecture Markdown.
   * Uses template files for deterministic remediation.
   */
  static generatePatch(breachId: string, data: any): string {
    let templateFile: string;

    if (breachId === 'BREACH-004') {
      const residency = data.infrastructure?.data_residency;
      if (residency === 'Foreign') {
        templateFile = 'BREACH-004-foreign.md';
      } else if (residency === 'Hybrid') {
        templateFile = 'BREACH-004-hybrid.md';
      } else {
        templateFile = 'BREACH-004-default.md';
      }
    } else {
      templateFile = `${breachId}.md`;
    }

    const templatePath = path.join(this.templatesDir, templateFile);

    if (fs.existsSync(templatePath)) {
      let content = fs.readFileSync(templatePath, 'utf8');
      // Replace placeholders
      content = content.replace(/\{\{retentionDays\}\}/g, String(data.retentionDays || 365));
      return content;
    }

    return `## Remediation for ${breachId}\nPlease review the regulatory requirement and update the architecture spec.`;
  }
}

import fs from 'fs';
import path from 'path';

export class TestGenerator {
  private static templatesDir = path.join(__dirname, '..', '..', 'templates', 'tests');

  /**
   * Deterministic integration test scaffolding.
   * Loads templates from files for syntactically-correct output.
   */
  static generateTest(breachId: string, data: any): string {
    const templatePath = path.join(this.templatesDir, `${breachId}.ts`);

    if (fs.existsSync(templatePath)) {
      return fs.readFileSync(templatePath, 'utf8');
    }

    return `// Test for ${breachId}\n// Manual implementation required.`;
  }
}

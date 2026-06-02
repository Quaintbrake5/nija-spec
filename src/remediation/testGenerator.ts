import fs from 'fs';
import path from 'path';
import { getGenerator } from '../generators';

export class TestGenerator {
  private static langFrameworkMap: Record<string, string> = {
    'typescript': 'jest',
    'javascript': 'jest',
    'python': 'pytest',
    'go': 'testing',
    'java': 'junit',
    'csharp': 'xunit',
    'php': 'phpunit',
  };

  /**
   * Deterministic integration test scaffolding.
   * Loads templates from files for syntactically-correct output.
   */
  static generateTest(breachId: string, data: any, language: string = 'typescript'): string {
    const framework = this.langFrameworkMap[language.toLowerCase()] || 'jest';
    const generator = getGenerator(language.toLowerCase(), framework);

    if (generator) {
      return generator.generate(data, breachId);
    }

    // Fallback for typescript/javascript if generator not found but templates exist
    const defaultTemplatesDir = path.join(__dirname, '..', '..', 'templates', 'tests');
    const templatePath = path.join(defaultTemplatesDir, `${breachId}.ts`);

    if (fs.existsSync(templatePath)) {
      return fs.readFileSync(templatePath, 'utf8');
    }

    return `// Test for ${breachId}\n// Manual implementation required.`;
  }
}

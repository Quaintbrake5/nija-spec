import fs from 'fs';
import path from 'path';
import { Generator } from './interface';

export class TypeScriptGenerator implements Generator {
  name = 'jest-typescript';
  language = 'typescript';
  framework = 'jest';

  private templatesDir = path.join(__dirname, '..', '..', 'templates', 'tests');

  generate(data: Record<string, any>, breachId: string): string {
    const templatePath = path.join(this.templatesDir, `${breachId}.ts`);

    if (fs.existsSync(templatePath)) {
      return fs.readFileSync(templatePath, 'utf8');
    }

    return `// Test for ${breachId}\n// Manual implementation required.\nimport { describe, it, expect } from '@jest/globals';\n`;
  }

  validate(code: string): boolean {
    return code.includes('describe(') && code.includes('expect(');
  }
}

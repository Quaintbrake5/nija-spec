import fs from 'fs';
import path from 'path';
import { Generator } from './interface';

export class CSharpGenerator implements Generator {
  name = 'xunit-csharp';
  language = 'csharp';
  framework = 'xunit';

  private templatesDir = path.join(__dirname, '..', '..', 'templates', 'tests-csharp');

  generate(data: Record<string, any>, breachId: string): string {
    const templatePath = path.join(this.templatesDir, `${breachId}.cs`);

    if (fs.existsSync(templatePath)) {
      return fs.readFileSync(templatePath, 'utf8');
    }

    return `// Test for ${breachId}\n// Manual implementation required.\nusing Xunit;\n`
  }

  validate(code: string): boolean {
    return code.includes('[Fact]') || code.includes('[Test]');
  }
}

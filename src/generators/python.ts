import fs from 'fs';
import path from 'path';
import { Generator } from './interface';

export class PythonGenerator implements Generator {
  name = 'pytest-python';
  language = 'python';
  framework = 'pytest';

  private templatesDir = path.join(__dirname, '..', '..', 'templates', 'tests-python');

  generate(data: Record<string, any>, breachId: string): string {
    const templatePath = path.join(this.templatesDir, `${breachId}.py`);

    if (fs.existsSync(templatePath)) {
      return fs.readFileSync(templatePath, 'utf8');
    }

    return `# Test for ${breachId}\n# Manual implementation required.\nimport pytest\n`;
  }

  validate(code: string): boolean {
    return code.includes('def test_') && code.includes('assert');
  }
}

import fs from 'fs';
import path from 'path';
import { Generator } from './interface';

export class JavaGenerator implements Generator {
  name = 'junit-java';
  language = 'java';
  framework = 'junit';

  private templatesDir = path.join(__dirname, '..', '..', 'templates', 'tests-java');

  generate(data: Record<string, any>, breachId: string): string {
    const templatePath = path.join(this.templatesDir, `${breachId}.java`);

    if (fs.existsSync(templatePath)) {
      return fs.readFileSync(templatePath, 'utf8');
    }

    return `// Test for ${breachId}\n// Manual implementation required.\nimport org.junit.jupiter.api.Test;\nimport static org.junit.jupiter.api.Assertions.*;\n`
  }

  validate(code: string): boolean {
    return code.includes('@Test') && code.includes('void test');
  }
}

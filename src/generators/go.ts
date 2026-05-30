import fs from 'fs';
import path from 'path';
import { Generator } from './interface';

export class GoGenerator implements Generator {
  name = 'go-test';
  language = 'go';
  framework = 'testing';

  private templatesDir = path.join(__dirname, '..', '..', 'templates', 'tests-go');

  generate(data: Record<string, any>, breachId: string): string {
    const templatePath = path.join(this.templatesDir, `${breachId}.go`);

    if (fs.existsSync(templatePath)) {
      return fs.readFileSync(templatePath, 'utf8');
    }

    return `package main\n\nimport "testing"\n\n// Test for ${breachId}\n// Manual implementation required.\n`;
  }

  validate(code: string): boolean {
    return code.includes('func Test') && code.includes('testing.T');
  }
}
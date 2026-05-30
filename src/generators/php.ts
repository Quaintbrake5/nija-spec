import fs from 'fs';
import path from 'path';
import { Generator } from './interface';

export class PhpGenerator implements Generator {
  name = 'phpunit-php';
  language = 'php';
  framework = 'phpunit';

  private templatesDir = path.join(__dirname, '..', '..', 'templates', 'tests-php');

  generate(data: Record<string, any>, breachId: string): string {
    const templatePath = path.join(this.templatesDir, `${breachId}.php`);

    if (fs.existsSync(templatePath)) {
      return fs.readFileSync(templatePath, 'utf8');
    }

    return `<?php\n// Test for ${breachId}\n// Manual implementation required.\nuse PHPUnit\\Framework\\TestCase;\n`
  }

  validate(code: string): boolean {
    return code.includes('public function test') && code.includes('TestCase');
  }
}
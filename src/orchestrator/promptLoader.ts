import fs from 'fs';
import path from 'path';

export interface PromptManifest {
  version: string;
  path: string;
  hash: string;
}

export class PromptLoader {
  private promptsDir: string;

  constructor(promptsDir?: string) {
    this.promptsDir = promptsDir || path.join(__dirname, '..', '..', '.nijaspec', 'prompts');
  }

  /** Load a prompt by name and version */
  load(name: string, version: string = 'v1'): string {
    const promptPath = path.join(this.promptsDir, `${name}-${version}.txt`);

    if (!fs.existsSync(promptPath)) {
      throw new Error(`Prompt not found: ${promptPath}`);
    }

    return fs.readFileSync(promptPath, 'utf8');
  }

  /** Get manifest info for a prompt */
  getManifest(name: string, version: string = 'v1'): PromptManifest {
    const promptPath = path.join(this.promptsDir, `${name}-${version}.txt`);

    if (!fs.existsSync(promptPath)) {
      throw new Error(`Prompt not found: ${promptPath}`);
    }

    const content = fs.readFileSync(promptPath, 'utf8');

    return {
      version,
      path: promptPath,
      hash: this.simpleHash(content)
    };
  }

  /** List available prompt versions */
  listVersions(name: string): string[] {
    if (!fs.existsSync(this.promptsDir)) {
      return [];
    }

    const files = fs.readdirSync(this.promptsDir);
    const versions: string[] = [];

    for (const file of files) {
      const match = file.match(new RegExp(`^${name}-(v\\d+)\\.txt$`));
      if (match) {
        versions.push(match[1]);
      }
    }

    return versions.sort();
  }

  /** Simple hash for manifest provenance */
  private simpleHash(content: string): string {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
}

import axios from 'axios';
import { LLMProvider } from './llmProvider';

export interface LocalModelConfig {
  endpoint: string;
  model: string;
  timeout?: number;
}

export class LocalModel implements LLMProvider {
  name = 'ollama';
  private config: LocalModelConfig;

  constructor(config: LocalModelConfig) {
    this.config = config;
  }

  /**
   * Runs local semantic extraction via Ollama/Qwen in JSON-mode.
   * Ensures no data leaves the machine for high-privacy architecture specs.
   */
  async extract(prompt: string, schema: any): Promise<any> {
    try {
      const response = await axios.post(this.config.endpoint, {
        model: this.config.model,
        prompt: prompt,
        stream: false,
        format: 'json', // Force JSON mode
      }, {
        timeout: this.config.timeout || 30000
      });

      return JSON.parse(response.data.response);
    } catch (error: any) {
      throw new Error(`Local model extraction failed: ${error.message}`);
    }
  }
}

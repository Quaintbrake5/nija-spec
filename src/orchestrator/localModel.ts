import axios from 'axios';
import { LLMProvider } from './llmProvider';

export interface LocalModelConfig {
  endpoint: string;
  model: string;
  timeout?: number;
}

/**
 * @deprecated Ollama support is deprecated as of June 2026.
 * Timeline: Full removal scheduled for December 2026.
 * Recommended Alternatives:
 * - Use Gemini cloud for higher accuracy and reliability.
 * - Use MockExtractor for offline/CI environments.
 */
export class LocalModel implements LLMProvider {
  name = 'ollama';
  private config: LocalModelConfig;

  constructor(config: LocalModelConfig) {
    console.warn('[Deprecation Warning] LocalModel (Ollama) is deprecated. Please migrate to Gemini cloud or MockExtractor before December 2026.');
    this.config = config;
  }

  /**
   * Runs local semantic extraction via Ollama/Qwen in JSON-mode.
   * Ensures no data leaves the machine for high-privacy architecture specs.
   */
  async extract(prompt: string, schema: any): Promise<any> {
    console.warn('[Deprecation Warning] Ollama extraction is deprecated. Transition to Gemini cloud or MockExtractor.');
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

import axios from 'axios';
import { LLMProvider } from './llmProvider';

export interface GeminiConfig {
  apiKey: string;
  model?: string;
  timeout?: number;
}

export class GeminiAdapter implements LLMProvider {
  name = 'gemini';
  private config: GeminiConfig;

  constructor(config: GeminiConfig) {
    this.config = config;
  }

  async extract(prompt: string, schema: any): Promise<any> {
    const model = this.config.model || 'gemini-2.5-flash';
    
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.config.apiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: schema
          }
        },
        { timeout: this.config.timeout || 30000 }
      );

      return JSON.parse(response.data.candidates[0].content.parts[0].text);
    } catch (error: any) {
      throw new Error(`Gemini extraction failed: ${error.message}`);
    }
  }
}
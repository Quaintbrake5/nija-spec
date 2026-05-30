import { LLMProvider } from './llmProvider';
import { MockExtractor } from './mockExtractor';

export class MockExtractorAdapter implements LLMProvider {
  name = 'mock';

  async extract(prompt: string, schema: any): Promise<any> {
    // MockExtractor processes the prompt content directly
    return MockExtractor.extract(prompt);
  }
}
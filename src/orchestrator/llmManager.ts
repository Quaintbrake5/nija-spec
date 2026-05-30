import { LLMProvider } from './llmProvider';

export class LLMManager {
  private providers: LLMProvider[];
  private current_index = 0;

  constructor(providers: LLMProvider[]) {
    this.providers = providers;
    if (providers.length === 0) {
      throw new Error('LLMManager requires at least one provider');
    }
  }

  /** Get the currently active provider */
  getActiveProvider(): LLMProvider {
    return this.providers[this.current_index];
  }

  /** Extract using current provider with fallback to next on failure */
  async extract(prompt: string, schema: any): Promise<any> {
    let lastError: Error | null = null;

    for (let i = 0; i < this.providers.length; i++) {
      const providerIndex = (this.current_index + i) % this.providers.length;
      const provider = this.providers[providerIndex];

      try {
        const result = await provider.extract(prompt, schema);
        this.current_index = providerIndex;
        return result;
      } catch (error: any) {
        lastError = error;
        console.warn(`Provider ${provider.name} failed: ${error.message}`);
        if (i < this.providers.length - 1) {
          console.log(`Falling back to next provider...`);
        }
      }
    }

    throw new Error(`All LLM providers failed. Last error: ${lastError?.message}`);
  }

  /** List all available providers */
  listProviders(): string[] {
    return this.providers.map(p => p.name);
  }
}
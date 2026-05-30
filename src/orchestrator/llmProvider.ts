export interface LLMProvider {
  /** Unique name for this provider */
  name: string;
  
  /** Extract structured data from content using LLM */
  extract(prompt: string, schema: any): Promise<any>;
}
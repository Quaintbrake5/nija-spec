export interface Generator {
  /** Unique name for this generator (e.g., 'jest-typescript') */
  name: string;
  
  /** Target language (e.g., 'typescript', 'python', 'go') */
  language: string;
  
  /** Target framework (e.g., 'jest', 'pytest', 'go-test') */
  framework: string;
  
  /** Generate code from extracted compliance data for a specific breach */
  generate(data: Record<string, any>, breachId: string): string;
  
  /** Validate that generated code is syntactically correct */
  validate(code: string): boolean;
}

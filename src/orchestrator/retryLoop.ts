export class RetryLoop {
  /**
   * 3-strike choke point for malformed model output.
   * Halts the pipeline if the model fails to produce valid JSON after 3 attempts.
   */
  static async execute<T>(
    task: () => Promise<T>,
    maxRetries = 3
  ): Promise<T> {
    let lastError: any;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await task();
      } catch (error: unknown) {
        lastError = error;
        console.warn(`Attempt ${i + 1}/${maxRetries} failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    throw new Error(`Task failed after ${maxRetries} attempts. Last error: ${lastError?.message}`);
  }
}

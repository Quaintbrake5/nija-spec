"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryLoop = void 0;
class RetryLoop {
    /**
     * 3-strike choke point for malformed model output.
     * Halts the pipeline if the model fails to produce valid JSON after 3 attempts.
     */
    static async execute(task, maxRetries = 3) {
        let lastError;
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await task();
            }
            catch (error) {
                lastError = error;
                console.warn(`Attempt ${i + 1}/${maxRetries} failed: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
        throw new Error(`Task failed after ${maxRetries} attempts. Last error: ${lastError?.message}`);
    }
}
exports.RetryLoop = RetryLoop;

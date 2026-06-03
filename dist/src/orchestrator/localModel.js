"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalModel = void 0;
const axios_1 = __importDefault(require("axios"));
/**
 * @deprecated Ollama support is deprecated as of June 2026.
 * Timeline: Full removal scheduled for December 2026.
 * Recommended Alternatives:
 * - Use Gemini cloud for higher accuracy and reliability.
 * - Use MockExtractor for offline/CI environments.
 */
class LocalModel {
    constructor(config) {
        this.name = 'ollama';
        console.warn('[Deprecation Warning] LocalModel (Ollama) is deprecated. Please migrate to Gemini cloud or MockExtractor before December 2026.');
        this.config = config;
    }
    /**
     * Runs local semantic extraction via Ollama/Qwen in JSON-mode.
     * Ensures no data leaves the machine for high-privacy architecture specs.
     */
    async extract(prompt, schema) {
        console.warn('[Deprecation Warning] Ollama extraction is deprecated. Transition to Gemini cloud or MockExtractor.');
        try {
            const response = await axios_1.default.post(this.config.endpoint, {
                model: this.config.model,
                prompt: prompt,
                stream: false,
                format: 'json', // Force JSON mode
            }, {
                timeout: this.config.timeout || 30000
            });
            return JSON.parse(response.data.response);
        }
        catch (error) {
            throw new Error(`Local model extraction failed: ${error.message}`);
        }
    }
}
exports.LocalModel = LocalModel;

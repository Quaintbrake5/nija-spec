"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalModel = void 0;
const axios_1 = __importDefault(require("axios"));
class LocalModel {
    constructor(config) {
        this.config = config;
    }
    /**
     * Runs local semantic extraction via Ollama/Qwen in JSON-mode.
     * Ensures no data leaves the machine for high-privacy architecture specs.
     */
    async extract(prompt, schema) {
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

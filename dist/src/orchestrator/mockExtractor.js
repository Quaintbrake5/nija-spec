"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockExtractor = void 0;
class MockExtractor {
    /**
     * Deterministic extractor that parses key-value pairs from Markdown
     * sections without calling an LLM. Used for CI and offline testing.
     */
    static extract(content) {
        const result = {};
        const lines = content.split(/\r?\n/);
        let currentSection = '';
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed)
                continue;
            if (trimmed.startsWith('# ')) {
                currentSection = trimmed.replace(/^#\s*/, '').toLowerCase().replace(/\s+/g, '_');
                result[currentSection] = {};
            }
            else if (trimmed.startsWith('- ') && currentSection) {
                const match = trimmed.replace(/^-\s*/, '').match(/^([^:]+):\s*(.+)$/);
                if (match) {
                    let key = match[1].trim().toLowerCase().replace(/\s+/g, '_');
                    const mapping = this.KEY_MAP[currentSection];
                    if (mapping && mapping[key]) {
                        key = mapping[key];
                    }
                    result[currentSection][key] = match[2].trim();
                }
            }
        }
        return result;
    }
}
exports.MockExtractor = MockExtractor;
MockExtractor.KEY_MAP = {
    authentication: { tls: 'tls_version' },
    data_lifecycle: { pii_categories: 'pii_categories' },
};

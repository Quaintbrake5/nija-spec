"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mockExtractor_1 = require("./mockExtractor");
describe('MockExtractor', () => {
    it('should extract sections from markdown', () => {
        const content = '# Infrastructure\n- Hosting: AWS\n- Region: us-east-1';
        const result = mockExtractor_1.MockExtractor.extract(content);
        expect(result.infrastructure).toBeDefined();
        expect(result.infrastructure.hosting).toBe('AWS');
        expect(result.infrastructure.region).toBe('us-east-1');
    });
    it('should map keys via KEY_MAP', () => {
        const content = '# Authentication\n- TLS: 1.2';
        const result = mockExtractor_1.MockExtractor.extract(content);
        expect(result.authentication.tls_version).toBe('1.2');
    });
    it('should handle empty content', () => {
        const result = mockExtractor_1.MockExtractor.extract('');
        expect(Object.keys(result)).toHaveLength(0);
    });
    it('should handle multiple sections', () => {
        const content = '# Infrastructure\n- Hosting: AWS\n# Authentication\n- MFA: Enabled';
        const result = mockExtractor_1.MockExtractor.extract(content);
        expect(result.infrastructure).toBeDefined();
        expect(result.authentication).toBeDefined();
    });
    it('should normalize section names to snake_case', () => {
        const content = '# Data Lifecycle\n- Retention: 90 days';
        const result = mockExtractor_1.MockExtractor.extract(content);
        expect(result.data_lifecycle).toBeDefined();
        expect(result.data_lifecycle.retention).toBe('90 days');
    });
});

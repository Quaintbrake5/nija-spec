"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const headerValidator_1 = require("./headerValidator");
describe('HeaderValidator', () => {
    const validAst = [
        '# Infrastructure',
        '- Hosting: AWS',
        '# Data Lifecycle',
        '- Retention: 90 days',
        '# Authentication',
        '- TLS: 1.2',
        '# Audit Metadata',
        '- Author: Admin'
    ];
    it('should pass with all required headers', () => {
        const result = headerValidator_1.HeaderValidator.validate(validAst);
        expect(result.valid).toBe(true);
        expect(result.missing).toEqual([]);
    });
    it('should fail when headers are missing', () => {
        const ast = ['# Infrastructure', '- Hosting: AWS'];
        const result = headerValidator_1.HeaderValidator.validate(ast);
        expect(result.valid).toBe(false);
        expect(result.missing).toContain('# Data Lifecycle');
        expect(result.missing).toContain('# Authentication');
        expect(result.missing).toContain('# Audit Metadata');
    });
    it('should be case-insensitive', () => {
        const ast = ['# infrastructure', '# data lifecycle', '# authentication', '# audit metadata'];
        const result = headerValidator_1.HeaderValidator.validate(ast);
        expect(result.valid).toBe(true);
    });
    it('should match partial header names when found header contains required name', () => {
        const ast = ['# Infrastructure Details', '# Data Lifecycle Policy', '# Authentication Setup', '# Audit Metadata Info'];
        const result = headerValidator_1.HeaderValidator.validate(ast);
        expect(result.valid).toBe(true);
    });
    it('should return all missing headers', () => {
        const result = headerValidator_1.HeaderValidator.validate([]);
        expect(result.valid).toBe(false);
        expect(result.missing).toHaveLength(4);
    });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compliance_1 = require("./compliance");
describe('ComplianceEngine', () => {
    const schema = {
        type: 'object',
        required: ['infrastructure'],
        properties: {
            infrastructure: { type: 'object' }
        }
    };
    it('should pass validation for valid data', () => {
        const data = { infrastructure: { hosting: 'AWS' } };
        const result = compliance_1.ComplianceEngine.validate(data, schema);
        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);
    });
    it('should fail when required field is missing', () => {
        const data = { authentication: { tls: '1.2' } };
        const result = compliance_1.ComplianceEngine.validate(data, schema);
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
    });
    it('should validate enum constraints', () => {
        const enumSchema = {
            type: 'object',
            properties: {
                tls: { type: 'string', enum: ['1.2', '1.3'] }
            }
        };
        const valid = { tls: '1.2' };
        const invalid = { tls: '1.1' };
        expect(compliance_1.ComplianceEngine.validate(valid, enumSchema).valid).toBe(true);
        expect(compliance_1.ComplianceEngine.validate(invalid, enumSchema).valid).toBe(false);
    });
    it('should return all errors', () => {
        const strictSchema = {
            type: 'object',
            required: ['a', 'b', 'c'],
            properties: {
                a: { type: 'string' },
                b: { type: 'string' },
                c: { type: 'string' }
            }
        };
        const result = compliance_1.ComplianceEngine.validate({}, strictSchema);
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBe(3);
    });
});

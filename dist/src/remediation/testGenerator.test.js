"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testGenerator_1 = require("./testGenerator");
describe('TestGenerator', () => {
    it('should generate test for BREACH-001', () => {
        const test = testGenerator_1.TestGenerator.generateTest('BREACH-001', {});
        expect(test).toContain('retention policy');
        expect(test).toContain('test(');
    });
    it('should generate test for BREACH-002', () => {
        const test = testGenerator_1.TestGenerator.generateTest('BREACH-002', {});
        expect(test).toContain('TLS');
        expect(test).toContain('test(');
    });
    it('should generate test for BREACH-003', () => {
        const test = testGenerator_1.TestGenerator.generateTest('BREACH-003', {});
        expect(test).toContain('pii_categories');
        expect(test).toContain('test(');
    });
    it('should generate test for BREACH-004', () => {
        const test = testGenerator_1.TestGenerator.generateTest('BREACH-004', {});
        expect(test).toContain('data_residency');
        expect(test).toContain('test(');
    });
    it('should generate test for BREACH-005', () => {
        const test = testGenerator_1.TestGenerator.generateTest('BREACH-005', {});
        expect(test).toContain('mfa');
        expect(test).toContain('test(');
    });
    it('should generate test for BREACH-006', () => {
        const test = testGenerator_1.TestGenerator.generateTest('BREACH-006', {});
        expect(test).toContain('classification');
        expect(test).toContain('test(');
    });
    it('should generate stub for unknown breach ID', () => {
        const test = testGenerator_1.TestGenerator.generateTest('BREACH-999', {});
        expect(test).toContain('BREACH-999');
        expect(test).toContain('Manual implementation');
    });
    it('should return valid JavaScript syntax', () => {
        const test = testGenerator_1.TestGenerator.generateTest('BREACH-001', {});
        expect(test).toContain('test(');
        expect(test).toContain('expect(');
    });
});

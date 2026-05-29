import { TestGenerator } from './testGenerator';

describe('TestGenerator', () => {
  it('should generate test for BREACH-001', () => {
    const test = TestGenerator.generateTest('BREACH-001', {});
    expect(test).toContain('retention policy');
    expect(test).toContain('test(');
  });

  it('should generate test for BREACH-002', () => {
    const test = TestGenerator.generateTest('BREACH-002', {});
    expect(test).toContain('TLS');
    expect(test).toContain('test(');
  });

  it('should generate stub for unknown breach ID', () => {
    const test = TestGenerator.generateTest('BREACH-999', {});
    expect(test).toContain('BREACH-999');
    expect(test).toContain('Manual implementation');
  });

  it('should return valid JavaScript syntax', () => {
    const test = TestGenerator.generateTest('BREACH-001', {});
    expect(test).toContain('test(');
    expect(test).toContain('expect(');
  });
});

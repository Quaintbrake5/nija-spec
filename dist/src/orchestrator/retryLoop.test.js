"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const retryLoop_1 = require("./retryLoop");
describe('RetryLoop', () => {
    it('should succeed on first attempt', async () => {
        const task = jest.fn().mockResolvedValue('success');
        const result = await retryLoop_1.RetryLoop.execute(task);
        expect(result).toBe('success');
        expect(task).toHaveBeenCalledTimes(1);
    });
    it('should retry on failure and succeed', async () => {
        const task = jest.fn()
            .mockRejectedValueOnce(new Error('fail 1'))
            .mockResolvedValue('success');
        const result = await retryLoop_1.RetryLoop.execute(task);
        expect(result).toBe('success');
        expect(task).toHaveBeenCalledTimes(2);
    });
    it('should throw after max retries', async () => {
        const task = jest.fn().mockRejectedValue(new Error('always fails'));
        await expect(retryLoop_1.RetryLoop.execute(task, 3)).rejects.toThrow('Task failed after 3 attempts');
        expect(task).toHaveBeenCalledTimes(3);
    });
    it('should default to 3 retries', async () => {
        const task = jest.fn().mockRejectedValue(new Error('fail'));
        await expect(retryLoop_1.RetryLoop.execute(task)).rejects.toThrow();
        expect(task).toHaveBeenCalledTimes(3);
    });
    it('should pass through the task function', async () => {
        const task = jest.fn().mockResolvedValue(42);
        const result = await retryLoop_1.RetryLoop.execute(task);
        expect(result).toBe(42);
    });
});

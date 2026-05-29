"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderValidator = void 0;
class HeaderValidator {
    /**
     * Required section enforcement (Iron Gate)
     * Rejects specs that are missing critical structural headers.
     */
    static validate(ast) {
        const requiredHeaders = [
            '# Infrastructure',
            '# Data Lifecycle',
            '# Authentication',
            '# Audit Metadata'
        ];
        const foundHeaders = ast.filter(line => line.startsWith('#'));
        const missing = requiredHeaders.filter(rh => !foundHeaders.some(fh => fh.toLowerCase().includes(rh.toLowerCase().replace('# ', ''))));
        return {
            valid: missing.length === 0,
            missing
        };
    }
}
exports.HeaderValidator = HeaderValidator;

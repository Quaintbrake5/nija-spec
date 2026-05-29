"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceEngine = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const ajv = new ajv_1.default({ allErrors: true });
(0, ajv_formats_1.default)(ajv);
class ComplianceEngine {
    /**
     * Core schema validation engine.
     * Validates extracted JSON against compliance-spec.json.
     */
    static validate(data, schema) {
        const validate = ajv.compile(schema);
        const valid = validate(data);
        return {
            valid,
            errors: validate.errors || []
        };
    }
}
exports.ComplianceEngine = ComplianceEngine;

import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export class ComplianceEngine {
  /**
   * Core schema validation engine.
   * Validates extracted JSON against compliance-spec.json.
   */
  static validate(data: any, schema: any): { valid: boolean; errors: any[] } {
    const validate = ajv.compile(schema);
    const valid = validate(data);

    return {
      valid,
      errors: validate.errors || []
    };
  }
}

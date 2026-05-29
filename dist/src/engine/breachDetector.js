"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BreachDetector = void 0;
class BreachDetector {
    /**
     * Runs Breach Detection Matrix (NDPA, CBN, SEC).
     * Each rule is mapped to a regulatory article.
     */
    static detect(data, rules) {
        const breaches = [];
        for (const rule of rules) {
            const isBreached = this.evaluateRule(data, rule);
            if (isBreached) {
                breaches.push({
                    id: rule.id,
                    severity: rule.severity,
                    framework: rule.framework,
                    finding: rule.finding,
                    risk: rule.risk,
                    article: rule.article
                });
            }
        }
        return breaches;
    }
    static evaluateRule(data, rule) {
        // Simple logic: if rule.condition is missing in data or fails
        // In a real system, this would use a more complex rule engine
        const value = this.getValueByPath(data, rule.path);
        if (rule.type === 'required' && (value === undefined || value === null)) {
            return true;
        }
        if (rule.type === 'enum' && !rule.values.includes(value)) {
            return true;
        }
        return false;
    }
    static getValueByPath(obj, path) {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    }
}
exports.BreachDetector = BreachDetector;

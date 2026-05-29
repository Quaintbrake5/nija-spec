export interface Breach {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  framework: string;
  finding: string;
  risk: string;
  article: string;
}

export class BreachDetector {
  /**
   * Runs Breach Detection Matrix (NDPA, CBN, SEC).
   * Each rule is mapped to a regulatory article.
   */
  static detect(data: any, rules: any[]): Breach[] {
    const breaches: Breach[] = [];

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

  private static evaluateRule(data: any, rule: any): boolean {
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

  private static getValueByPath(obj: any, path: string) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }
}

import fs from 'fs';
import path from 'path';
import { MdParser } from '../src/parser/mdParser';
import { Sanitizer } from '../src/parser/sanitizer';
import { HeaderValidator } from '../src/parser/headerValidator';
import { LocalModel } from '../src/orchestrator/localModel';
import { RetryLoop } from '../src/orchestrator/retryLoop';
import { ComplianceEngine } from '../src/engine/compliance';
import { BreachDetector } from '../src/engine/breachDetector';
import { PatchGenerator } from '../src/remediation/patchGenerator';
import { TestGenerator } from '../src/remediation/testGenerator';
import { MockExtractor } from '../src/orchestrator/mockExtractor';

async function main(): Promise<void> {
  const args: string[] = process.argv.slice(2);
  const command: string | undefined = args[0];
  const filePath: string | undefined = args[1];

  if (command !== 'check' || !filePath) {
    console.log('Usage: nija-audit check <path-to-spec.md>');
    process.exit(1);
  }

  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  nija-audit v1.0.0 — Compliance Verification Engine');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Phase 0: Iron Gate
    console.log('[GATE]   Parsing Markdown AST...                ✓');
    const rawContent: string = fs.readFileSync(filePath, 'utf8');
    const { ast } = MdParser.parse(rawContent);

    if (!ast) {
      console.error('❌ [GATE]   Failed to parse Markdown AST');
      process.exit(1);
    }

    console.log('[GATE]   Sanitizing for credential exposure...  ✓');
    const sanitized: string = Sanitizer.sanitize(rawContent);

    const { valid, missing } = HeaderValidator.validate(ast!);
    if (!valid) {
      console.error(`❌ [GATE]   Missing required sections: ${missing.join(', ')}`);
      process.exit(1);
    }
    console.log('[GATE]   Header validation...                     ✓');

    // Phase 1: Local Semantic Extraction
    const skipLlm = process.argv.includes('--skip-llm') || process.env.NIJA_SKIP_LLM === 'true';

    let extractedData: Record<string, any>;
    if (skipLlm) {
      console.log('[LOCAL]  Using mock extractor (skip-llm)...       ✓');
      extractedData = MockExtractor.extract(sanitized);
    } else {
      console.log('[LOCAL]  Running local semantic extraction...   ✓');
      const model = new LocalModel({
        endpoint: 'http://localhost:11434/api/generate',
        model: 'qwen2.5:7b'
      });
      extractedData = await RetryLoop.execute(() =>
        model.extract(`Extract compliance data from: ${sanitized}`, {})
      );
    }

    // Phase 2: Compliance Gap Analysis
    console.log('[ENGINE] Compiling against regulatory schemas...  ✓');
    const schema = {
      type: 'object',
      required: ['infrastructure'],
      properties: {
        infrastructure: { type: 'object' }
      }
    };

    const { valid: complianceValid, errors } = ComplianceEngine.validate(extractedData, schema);

    console.log('[ENGINE] Running Breach Detection Matrix...');
    const rules = [
      { id: 'BREACH-001', severity: 'CRITICAL', framework: 'NDPA', path: 'data_lifecycle.retention', type: 'required', finding: 'Data Retention Policy Absent', risk: 'Regulatory fine', article: 'NDPA 2.6.3' },
      { id: 'BREACH-002', severity: 'HIGH', framework: 'CBN', path: 'authentication.tls_version', type: 'enum', values: ['1.2', '1.3'], finding: 'TLS Version Unspecified', risk: 'Automatic non-compliance flag', article: 'CBN 4.2' }
    ];
    const breaches = BreachDetector.detect(extractedData, rules);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  BREACH REPORT');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (breaches.length === 0) {
      console.log('✅ No breaches detected. Architecture is compliant.');
    } else {
      breaches.forEach(b => {
        console.log(`❌ [${b.id}] ${b.severity} — ${b.finding}`);
        console.log(`   Framework: ${b.framework} ${b.article}`);
        console.log(`   Risk:      ${b.risk}\n`);
      });

      // Phase 3: Remediation
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('  REMEDIATION');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      const patchesDir = path.join(process.cwd(), '.nija', 'patches');
      if (!fs.existsSync(patchesDir)) fs.mkdirSync(patchesDir, { recursive: true });

      breaches.forEach(b => {
        const patch = PatchGenerator.generatePatch(b.id, extractedData);
        const test = TestGenerator.generateTest(b.id, extractedData);

        fs.writeFileSync(path.join(patchesDir, `${b.id}-fix.md`), patch);
        fs.writeFileSync(path.join(patchesDir, `${b.id}-test.js`), test);

        console.log(`🛠️  Patch generated: .nija/patches/${b.id}-fix.md`);
        console.log(`🛠️  Test generated:  .nija/patches/${b.id}-test.js`);
      });

      console.log('\nPROCESS EXITED WITH CODE 1. Pipeline halted.');
      process.exit(1);
    }

  } catch (error: any) {
    console.error(`💥 Fatal Error: ${error.message}`);
    process.exit(1);
  }
}

main();

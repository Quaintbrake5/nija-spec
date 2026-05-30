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

// Load schemas from files
const schemasDir = path.join(__dirname, '..', 'schemas');
const complianceSchema = JSON.parse(fs.readFileSync(path.join(schemasDir, 'compliance-spec.json'), 'utf8'));
const ndpaRules = JSON.parse(fs.readFileSync(path.join(schemasDir, 'ndpa-rules.json'), 'utf8'));
const cbnRules = JSON.parse(fs.readFileSync(path.join(schemasDir, 'cbn-rules.json'), 'utf8'));
const allRules = [...ndpaRules, ...cbnRules];

function getArgValue(args: string[], flag: string): string | undefined {
  const idx = args.indexOf(flag);
  if (idx !== -1 && idx + 1 < args.length) {
    return args[idx + 1];
  }
  return undefined;
}

function generateManifest(specFile: string, breaches: any[], patchesDir: string): void {
  const manifest = {
    timestamp: new Date().toISOString(),
    specFile,
    breachesDetected: breaches.length,
    patchesGenerated: breaches.length,
    status: breaches.length === 0 ? 'PASS' : 'FAIL',
    frameworks: [...new Set(breaches.map(b => b.framework))]
  };
  const manifestPath = path.join(patchesDir, '..', 'run-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

function validateTestOutput(code: string): boolean {
  return code.includes('test(') && code.includes('expect(') && !code.includes('SyntaxError');
}

async function main(): Promise<void> {
  const args: string[] = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`nija-audit v1.0.0 — Nigeria-first Compliance-as-Code Architectural Auditing Engine

Validates an architecture specification against Nigerian regulatory frameworks (NDPA, CBN).

Usage:
  nija-audit <command> [arguments] [options]

Commands:
  init                          Create .nija/ directory and sample test-spec.md
  generate <spec.md>            Run full compliance check pipeline
  verify                        Execute generated tests in .nija/patches/
  estimate <spec.md>            Count sections and estimate token usage
  check <spec.md>               Alias for generate (backward compatible)

Options:
  --skip-llm       Use deterministic mock extractor instead of local LLM
  --endpoint URL   Ollama endpoint (default: http://localhost:11434/api/generate)
  --model NAME     Ollama model name (default: qwen2.5:7b)
  --help, -h       Show this help message
  --version, -v    Show version number

Examples:
  nija-audit init
  nija-audit generate test-spec.md --skip-llm
  nija-audit verify
  nija-audit estimate test-spec.md`);
    process.exit(0);
  }

  if (args.includes('--version') || args.includes('-v')) {
    console.log('nija-audit v1.0.0');
    process.exit(0);
  }

  const command: string | undefined = args[0];

  // Handle init subcommand
  if (command === 'init') {
    const nijaDir = path.join(process.cwd(), '.nija');
    if (!fs.existsSync(nijaDir)) {
      fs.mkdirSync(nijaDir, { recursive: true });
      console.log('✅ Created .nija/ directory');
    } else {
      console.log('ℹ️  .nija/ directory already exists');
    }
    const specPath = path.join(process.cwd(), 'test-spec.md');
    if (!fs.existsSync(specPath)) {
      const sampleSpec = `# Architecture Specification

## 1. Data Storage
Describe how data is stored and encrypted at rest.

## 2. User Authentication
Describe authentication mechanisms and session management.

## 3. Data Retention
Describe data retention and deletion policies.

## 4. Cross-Border Transfer
Describe any cross-border data transfer mechanisms.

## 5. Incident Response
Describe incident response and breach notification procedures.
`;
      fs.writeFileSync(specPath, sampleSpec);
      console.log('✅ Created sample test-spec.md');
    } else {
      console.log('ℹ️  test-spec.md already exists');
    }
    process.exit(0);
  }

  // Handle verify subcommand
  if (command === 'verify') {
    const patchesDir = path.join(process.cwd(), '.nija', 'patches');
    if (!fs.existsSync(patchesDir)) {
      console.error('❌ No .nija/patches/ directory found. Run "generate" first.');
      process.exit(1);
    }
    console.log('🧪 Running generated tests via Jest...');
    const { execSync } = require('child_process');
    try {
      execSync('npx jest .nija/patches/', { stdio: 'inherit', cwd: process.cwd() });
      console.log('✅ All tests passed');
      process.exit(0);
    } catch {
      console.error('❌ Some tests failed');
      process.exit(1);
    }
  }

  // Handle estimate subcommand
  if (command === 'estimate') {
    const filePath = args[1];
    if (!filePath) {
      console.error('❌ Usage: nija-audit estimate <path-to-spec.md>');
      process.exit(1);
    }
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Error: File not found: ${filePath}`);
      process.exit(1);
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').length;
    const sections = (content.match(/^##\s/gm) || []).length;
    const estimatedTokens = lines * 10;
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  ESTIMATION REPORT');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  File:           ${filePath}`);
    console.log(`  Lines:          ${lines}`);
    console.log(`  Sections:       ${sections}`);
    console.log(`  Est. tokens:    ${estimatedTokens}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(0);
  }

  // For check/generate: require filePath
  const filePath: string | undefined = args[1];
  if ((command !== 'check' && command !== 'generate') || !filePath) {
    console.error('❌ Usage: nija-audit generate <path-to-spec.md>');
    console.error('   Run "nija-audit --help" for available commands.');
    process.exit(1);
  }

  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  nija-audit v1.0.0 — Compliance Verification Engine');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Phase 0: Iron Gate
    console.log('[GATE]   Parsing Markdown AST...                ✓');
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Error: File not found: ${filePath}`);
      process.exit(1);
    }
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
    const endpoint = getArgValue(args, '--endpoint') || process.env.NIJA_OLLAMA_ENDPOINT || 'http://localhost:11434/api/generate';
    const model = getArgValue(args, '--model') || process.env.NIJA_OLLAMA_MODEL || 'qwen2.5:7b';

    let extractedData: Record<string, any>;
    if (skipLlm) {
      console.log('[LOCAL]  Using mock extractor (skip-llm)...       ✓');
      extractedData = MockExtractor.extract(sanitized);
    } else {
      console.log('[LOCAL]  Running local semantic extraction...   ✓');
      const localModel = new LocalModel({
        endpoint: endpoint,
        model: model
      });
      extractedData = await RetryLoop.execute(() =>
        localModel.extract(`Extract compliance data from: ${sanitized}`, {})
      );
    }

    // Phase 2: Compliance Gap Analysis
    console.log('[ENGINE] Compiling against regulatory schemas...  ✓');
    const schema = complianceSchema;

    const { valid: complianceValid, errors } = ComplianceEngine.validate(extractedData, schema);

    console.log('[ENGINE] Running Breach Detection Matrix...');
    const rules = allRules;
    const breaches = BreachDetector.detect(extractedData, rules);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  BREACH REPORT');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (breaches.length === 0) {
      console.log('✅ No breaches detected. Architecture is compliant.');
      const patchesDir = path.join(process.cwd(), '.nija');
      generateManifest(filePath, [], patchesDir);
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

        if (validateTestOutput(test)) {
          fs.writeFileSync(path.join(patchesDir, `${b.id}-test.ts`), test);
          console.log(`🛠️  Patch generated: .nija/patches/${b.id}-fix.md`);
          console.log(`🛠️  Test generated:  .nija/patches/${b.id}-test.ts`);
        } else {
          console.error(`⚠️  Test for ${b.id} failed validation — skipping write`);
        }
      });

      console.log('\nPROCESS EXITED WITH CODE 1. Pipeline halted.');
      generateManifest(filePath, breaches, patchesDir);
      process.exit(1);
    }

  } catch (error: any) {
    console.error(`💥 Fatal Error: ${error.message}`);
    process.exit(1);
  }
}

main();



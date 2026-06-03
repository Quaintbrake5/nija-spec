"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mdParser_1 = require("../src/parser/mdParser");
const headerValidator_1 = require("../src/parser/headerValidator");
const compliance_1 = require("../src/engine/compliance");
const breachDetector_1 = require("../src/engine/breachDetector");
const patchGenerator_1 = require("../src/remediation/patchGenerator");
const testGenerator_1 = require("../src/remediation/testGenerator");
const llmManager_1 = require("../src/orchestrator/llmManager");
const localModel_1 = require("../src/orchestrator/localModel");
const mockExtractorAdapter_1 = require("../src/orchestrator/mockExtractorAdapter");
const geminiAdapter_1 = require("../src/orchestrator/geminiAdapter");
const promptLoader_1 = require("../src/orchestrator/promptLoader");
const sanitizer_1 = require("../src/parser/sanitizer");
function loadConfig() {
    const configPath = path_1.default.join(process.cwd(), '.nija-config.json');
    if (fs_1.default.existsSync(configPath)) {
        try {
            return JSON.parse(fs_1.default.readFileSync(configPath, 'utf8'));
        }
        catch {
            return {};
        }
    }
    return {};
}
// Load schemas from files
const schemasDir = path_1.default.join(__dirname, '..', 'schemas');
const complianceSchema = JSON.parse(fs_1.default.readFileSync(path_1.default.join(schemasDir, 'compliance-spec.json'), 'utf8'));
const ndpaRules = JSON.parse(fs_1.default.readFileSync(path_1.default.join(schemasDir, 'ndpa-rules.json'), 'utf8'));
const cbnRules = JSON.parse(fs_1.default.readFileSync(path_1.default.join(schemasDir, 'cbn-rules.json'), 'utf8'));
const allRules = [...ndpaRules, ...cbnRules];
function getArgValue(args, flag) {
    const idx = args.indexOf(flag);
    if (idx !== -1 && idx + 1 < args.length) {
        return args[idx + 1];
    }
    return undefined;
}
function generateManifest(specFile, breaches, patchesDir, promptVersion, redactionReport) {
    const manifest = {
        timestamp: new Date().toISOString(),
        specFile,
        breachesDetected: breaches.length,
        patchesGenerated: breaches.length,
        status: breaches.length === 0 ? 'PASS' : 'FAIL',
        frameworks: [...new Set(breaches.map(b => b.framework))],
        promptVersion: promptVersion || 'none',
        redactionSummary: redactionReport ? {
            patternsFound: redactionReport.patterns,
            totalRedactions: redactionReport.count
        } : { patternsFound: [], totalRedactions: 0 }
    };
    const manifestPath = path_1.default.join(patchesDir, '..', 'run-manifest.json');
    fs_1.default.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}
function validateTestOutput(code) {
    // Basic syntax checks
    if (!code.includes('test(') || !code.includes('expect(')) {
        return false;
    }
    if (code.includes('SyntaxError')) {
        return false;
    }
    // Check for balanced braces
    const openBraces = (code.match(/{/g) || []).length;
    const closeBraces = (code.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
        return false;
    }
    // Check for balanced parentheses
    const openParens = (code.match(/\(/g) || []).length;
    const closeParens = (code.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
        return false;
    }
    return true;
}
async function main() {
    const VERSION = 'v1.0.0';
    // Show banner unless requesting help or version
    const showBanner = !process.argv.includes('--help')
        && !process.argv.includes('-h')
        && !process.argv.includes('--version')
        && !process.argv.includes('-v');
    if (showBanner) {
        const isInteractive = !!(process.stdout && process.stdout.isTTY) && !process.env.CI;
        // Always emit a machine-parseable version line to stderr
        console.error(`NIJA ${VERSION}`);
        if (isInteractive) {
            // Decorative Unicode block-character banner — only rendered in interactive terminals
            // Letters: N  I  J  A (6 rows, same style as LiteLLM)
            const banner = [
                '',
                '███╗   ██╗  ██╗    ██╗    ████╗ ',
                '████╗  ██║  ██║    ██║   ██╔══██╗',
                '██╔██╗ ██║  ██║    ██║   ███████║',
                '██║╚██╗██║  ██║ ██╗ ██║   ██╔══██║',
                '██║ ╚████║  ██║ ╚█████╟   ██║  ██║',
                '╚═╝  ╚═══╝  ╚═╝   ╚════╝   ╚═╝  ╚═╝',
                '',
                '  "Architecture Compliance, Automated"',
                `              ${VERSION}`,
                '',
                '  Type "nija --help" for available commands.',
                '',
            ];
            try {
                process.stderr.write(banner.join('\n') + '\n');
            }
            catch {
                // ignore write errors during banner rendering
            }
        }
    }
    const args = process.argv.slice(2);
    if (args.includes('--help') || args.includes('-h')) {
        console.log(`NIJA v1.0.0 — Architecture Compliance, Automated

Validates architecture specifications against Nigerian regulatory frameworks (NDPA, CBN).

Usage:
  nija <command> [arguments] [options]

Commands:
  init                          Create .nija/ directory and sample test-spec.md
  generate <spec.md>            Run full compliance check pipeline
  verify                        Execute generated tests in .nija/patches/
  estimate <spec.md>            Count sections and estimate token usage
  check <spec.md>               Alias for generate (backward compatible)

Options:
  --skip-llm       Use deterministic mock extractor instead of local LLM
  --endpoint URL   Ollama endpoint (DEPRECATED: use --gemini or --skip-llm)
  --model NAME     Ollama model name (DEPRECATED: use --gemini or --skip-llm)
  --config PATH    Path to config file (default: .nija-config.json)
  --gemini         Use Gemini API for cloud extraction
  --gemini-key KEY Gemini API key (or set GEMINI_API_KEY env var)
  --gemini-model   Gemini model name (default: gemini-2.5-flash)
  --lang LANG      Target language for tests (typescript, python, go, java, csharp, php)
  --help, -h       Show this help message
  --version, -v    Show version number

Examples:
  nija init
  nija generate test-spec.md --skip-llm
  nija generate test-spec.md --lang python
  nija verify
  nija estimate test-spec.md`);
        process.exit(0);
    }
    if (args.includes('--version') || args.includes('-v')) {
        console.log('NIJA v1.0.0');
        process.exit(0);
    }
    const command = args[0];
    // Handle init subcommand
    if (command === 'init') {
        const nijaDir = path_1.default.join(process.cwd(), '.nija');
        if (!fs_1.default.existsSync(nijaDir)) {
            fs_1.default.mkdirSync(nijaDir, { recursive: true });
            console.log('✅ Created .nija/ directory');
        }
        else {
            console.log('ℹ️  .nija/ directory already exists');
        }
        const specPath = path_1.default.join(process.cwd(), 'test-spec.md');
        if (!fs_1.default.existsSync(specPath)) {
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
            fs_1.default.writeFileSync(specPath, sampleSpec);
            console.log('✅ Created sample test-spec.md');
        }
        else {
            console.log('ℹ️  test-spec.md already exists');
        }
        process.exit(0);
    }
    // Handle verify subcommand
    if (command === 'verify') {
        const patchesDir = path_1.default.join(process.cwd(), '.nija', 'patches');
        if (!fs_1.default.existsSync(patchesDir)) {
            console.error('❌ No .nija/patches/ directory found. Run "generate" first.');
            process.exit(1);
        }
        console.log('🧪 Running generated tests via Jest...');
        const { execSync } = require('child_process');
        try {
            execSync('npx jest .nija/patches/', { stdio: 'inherit', cwd: process.cwd() });
            console.log('✅ All tests passed');
            process.exit(0);
        }
        catch {
            console.error('❌ Some tests failed');
            process.exit(1);
        }
    }
    // Handle estimate subcommand
    if (command === 'estimate') {
        const filePath = args[1];
        if (!filePath) {
            console.error('❌ Usage: nija estimate <path-to-spec.md>');
            process.exit(1);
        }
        if (!fs_1.default.existsSync(filePath)) {
            console.error(`❌ Error: File not found: ${filePath}`);
            process.exit(1);
        }
        const content = fs_1.default.readFileSync(filePath, 'utf8');
        const lines = content.split('\n').length;
        const sections = (content.match(/^##\s/gm) || []).length;
        const estimatedTokens = lines * 10;
        // NGN cost estimation (Gemini 2.5 Flash pricing)
        const inputCostUSD = (estimatedTokens * 0.075) / 1000000;
        const outputCostUSD = (estimatedTokens * 0.30) / 1000000;
        const totalCostUSD = inputCostUSD + outputCostUSD;
        const usdToNGN = 1500;
        const totalCostNGN = totalCostUSD * usdToNGN;
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('  ESTIMATION REPORT');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`  File:           ${filePath}`);
        console.log(`  Lines:          ${lines}`);
        console.log(`  Sections:       ${sections}`);
        console.log(`  Est. tokens:    ${estimatedTokens}`);
        console.log(`  Est. NGN cost:  ₦${totalCostNGN.toFixed(2)} (at $${totalCostUSD.toFixed(4)} USD)`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        process.exit(0);
    }
    // For check/generate: require filePath
    const filePath = args[1];
    if ((command !== 'check' && command !== 'generate') || !filePath) {
        console.error('❌ Usage: nija generate <path-to-spec.md>');
        console.error('   Run "nija --help" for available commands.');
        process.exit(1);
    }
    try {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('  NIJA v1.0.0 — Compliance Verification Engine');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        // Phase 0: Iron Gate
        console.log('[GATE]   Parsing Markdown AST...                ✓');
        if (!fs_1.default.existsSync(filePath)) {
            console.error(`❌ Error: File not found: ${filePath}`);
            process.exit(1);
        }
        const rawContent = fs_1.default.readFileSync(filePath, 'utf8');
        const { ast } = mdParser_1.MdParser.parse(rawContent);
        if (!ast) {
            console.error('❌ [GATE]   Failed to parse Markdown AST');
            process.exit(1);
        }
        console.log('[GATE]   Sanitizing for credential exposure...  ✓');
        const redactionReport = sanitizer_1.Sanitizer.sanitizeWithReport(rawContent);
        const sanitized = redactionReport.redactedContent;
        if (redactionReport.count > 0) {
            console.log(`[GATE]   Redacted ${redactionReport.count} pattern(s)...       ✓`);
        }
        const { valid, missing } = headerValidator_1.HeaderValidator.validate(ast);
        if (!valid) {
            console.error(`❌ [GATE]   Missing required sections: ${missing.join(', ')}`);
            process.exit(1);
        }
        console.log('[GATE]   Header validation...                     ✓');
        // Phase 1: Extraction (using LLMManager)
        const config = loadConfig();
        const skipLlm = process.argv.includes('--skip-llm') || process.env.NIJA_SKIP_LLM === 'true';
        const useGemini = process.argv.includes('--gemini') || process.env.NIJA_USE_GEMINI === 'true';
        if (args.includes('--endpoint')) {
            console.warn('⚠️  Warning: --endpoint is deprecated. Please use --gemini for cloud extraction or --skip-llm for deterministic mocks.');
        }
        if (args.includes('--model')) {
            console.warn('⚠️  Warning: --model is deprecated. Please use --gemini for cloud extraction or --skip-llm for deterministic mocks.');
        }
        const endpoint = getArgValue(args, '--endpoint') || process.env.NIJA_OLLAMA_ENDPOINT || config.endpoint || 'http://localhost:11434/api/generate';
        const model = getArgValue(args, '--model') || process.env.NIJA_OLLAMA_MODEL || config.model || 'qwen2.5:7b';
        const geminiApiKey = getArgValue(args, '--gemini-key') || process.env.GEMINI_API_KEY || config.geminiApiKey;
        const geminiModel = getArgValue(args, '--gemini-model') || config.geminiModel || 'gemini-2.5-flash';
        // Build provider list based on flags
        const providers = [];
        if (skipLlm) {
            providers.push(new mockExtractorAdapter_1.MockExtractorAdapter());
        }
        else if (useGemini && geminiApiKey) {
            providers.push(new geminiAdapter_1.GeminiAdapter({ apiKey: geminiApiKey, model: geminiModel }));
        }
        else {
            providers.push(new localModel_1.LocalModel({ endpoint, model }));
        }
        const llmManager = new llmManager_1.LLMManager(providers);
        console.log(`[LOCAL]  Using provider: ${llmManager.getActiveProvider().name}...  ✓`);
        // Load prompt for extraction
        const promptLoader = new promptLoader_1.PromptLoader();
        let extractionPrompt;
        try {
            extractionPrompt = promptLoader.load('extraction', 'v1');
        }
        catch {
            extractionPrompt = `Extract compliance data as JSON from: ${sanitized}`;
        }
        const extractedData = await llmManager.extract(extractionPrompt.replace('{content}', sanitized), {});
        // Phase 2: Compliance Gap Analysis
        console.log('[ENGINE] Compiling against regulatory schemas...  ✓');
        const schema = complianceSchema;
        const { valid: complianceValid, errors } = compliance_1.ComplianceEngine.validate(extractedData, schema);
        console.log('[ENGINE] Running Breach Detection Matrix...');
        const rules = allRules;
        const breaches = breachDetector_1.BreachDetector.detect(extractedData, rules);
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('  BREACH REPORT');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        if (breaches.length === 0) {
            console.log('✅ No breaches detected. Architecture is compliant.');
            const patchesDir = path_1.default.join(process.cwd(), '.nija');
            generateManifest(filePath, [], patchesDir, 'v1', redactionReport);
        }
        else {
            breaches.forEach(b => {
                console.log(`❌ [${b.id}] ${b.severity} — ${b.finding}`);
                console.log(`   Framework: ${b.framework} ${b.article}`);
                console.log(`   Risk:      ${b.risk}\n`);
            });
            // Phase 3: Remediation
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('  REMEDIATION');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            const patchesDir = path_1.default.join(process.cwd(), '.nija', 'patches');
            if (!fs_1.default.existsSync(patchesDir))
                fs_1.default.mkdirSync(patchesDir, { recursive: true });
            breaches.forEach(b => {
                const patch = patchGenerator_1.PatchGenerator.generatePatch(b.id, extractedData);
                const lang = getArgValue(args, '--lang') || 'typescript';
                const test = testGenerator_1.TestGenerator.generateTest(b.id, extractedData, lang);
                fs_1.default.writeFileSync(path_1.default.join(patchesDir, `${b.id}-fix.md`), patch);
                const extensions = {
                    'typescript': 'ts',
                    'javascript': 'ts',
                    'python': 'py',
                    'go': 'go',
                    'java': 'java',
                    'csharp': 'cs',
                    'php': 'php',
                };
                const ext = extensions[lang.toLowerCase()] || 'ts';
                if (validateTestOutput(test)) {
                    fs_1.default.writeFileSync(path_1.default.join(patchesDir, `${b.id}-test.${ext}`), test);
                    console.log(`🛠️  Patch generated: .nija/patches/${b.id}-fix.md`);
                    console.log(`🛠️  Test generated:  .nija/patches/${b.id}-test.${ext}`);
                }
                else {
                    console.error(`⚠️  Test for ${b.id} failed validation — skipping write`);
                }
            });
            console.log('\nPROCESS EXITED WITH CODE 1. Pipeline halted.');
            generateManifest(filePath, breaches, patchesDir, 'v1', redactionReport);
            process.exit(1);
        }
    }
    catch (error) {
        console.error(`💥 Fatal Error: ${error.message}`);
        process.exit(1);
    }
}
main();

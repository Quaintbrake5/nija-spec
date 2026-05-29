"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mdParser_1 = require("../src/parser/mdParser");
const sanitizer_1 = require("../src/parser/sanitizer");
const headerValidator_1 = require("../src/parser/headerValidator");
const localModel_1 = require("../src/orchestrator/localModel");
const retryLoop_1 = require("../src/orchestrator/retryLoop");
const compliance_1 = require("../src/engine/compliance");
const breachDetector_1 = require("../src/engine/breachDetector");
const patchGenerator_1 = require("../src/remediation/patchGenerator");
const testGenerator_1 = require("../src/remediation/testGenerator");
const mockExtractor_1 = require("../src/orchestrator/mockExtractor");
// Load schemas from files
const schemasDir = path_1.default.join(__dirname, '..', 'schemas');
const complianceSchema = JSON.parse(fs_1.default.readFileSync(path_1.default.join(schemasDir, 'compliance-spec.json'), 'utf8'));
const ndpaRules = JSON.parse(fs_1.default.readFileSync(path_1.default.join(schemasDir, 'ndpa-rules.json'), 'utf8'));
const cbnRules = JSON.parse(fs_1.default.readFileSync(path_1.default.join(schemasDir, 'cbn-rules.json'), 'utf8'));
const allRules = [...ndpaRules, ...cbnRules];
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    const filePath = args[1];
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
        const rawContent = fs_1.default.readFileSync(filePath, 'utf8');
        const { ast } = mdParser_1.MdParser.parse(rawContent);
        if (!ast) {
            console.error('❌ [GATE]   Failed to parse Markdown AST');
            process.exit(1);
        }
        console.log('[GATE]   Sanitizing for credential exposure...  ✓');
        const sanitized = sanitizer_1.Sanitizer.sanitize(rawContent);
        const { valid, missing } = headerValidator_1.HeaderValidator.validate(ast);
        if (!valid) {
            console.error(`❌ [GATE]   Missing required sections: ${missing.join(', ')}`);
            process.exit(1);
        }
        console.log('[GATE]   Header validation...                     ✓');
        // Phase 1: Local Semantic Extraction
        const skipLlm = process.argv.includes('--skip-llm') || process.env.NIJA_SKIP_LLM === 'true';
        let extractedData;
        if (skipLlm) {
            console.log('[LOCAL]  Using mock extractor (skip-llm)...       ✓');
            extractedData = mockExtractor_1.MockExtractor.extract(sanitized);
        }
        else {
            console.log('[LOCAL]  Running local semantic extraction...   ✓');
            const model = new localModel_1.LocalModel({
                endpoint: 'http://localhost:11434/api/generate',
                model: 'qwen2.5:7b'
            });
            extractedData = await retryLoop_1.RetryLoop.execute(() => model.extract(`Extract compliance data from: ${sanitized}`, {}));
        }
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
                const test = testGenerator_1.TestGenerator.generateTest(b.id, extractedData);
                fs_1.default.writeFileSync(path_1.default.join(patchesDir, `${b.id}-fix.md`), patch);
                fs_1.default.writeFileSync(path_1.default.join(patchesDir, `${b.id}-test.js`), test);
                console.log(`🛠️  Patch generated: .nija/patches/${b.id}-fix.md`);
                console.log(`🛠️  Test generated:  .nija/patches/${b.id}-test.js`);
            });
            console.log('\nPROCESS EXITED WITH CODE 1. Pipeline halted.');
            process.exit(1);
        }
    }
    catch (error) {
        console.error(`💥 Fatal Error: ${error.message}`);
        process.exit(1);
    }
}
main();

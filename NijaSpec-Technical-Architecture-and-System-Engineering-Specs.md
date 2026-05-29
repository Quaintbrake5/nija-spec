# NijaSpec Technical Architecture & System Engineering Specs

**Document Class:** Core Engineering Specification  
**System Status:** Draft / Spec-Driven Blueprint  
**Target Architecture:** Model-Agnostic, Multi-Tenant Trust Infrastructure  

---

## 1. Decoupled `LLMProvider` Architecture

To eliminate the structural risk of foreign exchange volatility (Naira vs. USD) and safeguard against downstream vendor API changes or deprecations, NijaSpec decouples core orchestration from underlying model clients using a strict **Adapter Pattern**.

### 1.1 Interface Definition (`LLMProvider`)

```typescript
// src/core/llm/interfaces/llm-provider.interface.ts

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostNaira: number;
}

export interface LLMResponse {
  content: string;
  usage: TokenUsage;
  modelIdentifier: string;
}

export interface CompletionOptions {
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  jsonMode?: boolean;
}

export interface LLMProvider {
  id: string;
  name: string;
  
  /**
   * Generates text content based on user and optional system prompts
   */
  generateCompletion(
    prompt: string,
    options?: CompletionOptions
  ): Promise<LLMResponse>;

  /**
   * Pre-calculates the local token size to avoid unexpected billing surges
   */
  estimateTokens(text: string): Promise<number>;
}

```

### 1.2 Concrete Adapters (Gemini Cloud vs. Local Ollama)

#### Google Gemini Adapter

```typescript
// src/core/llm/adapters/gemini.adapter.ts
import { LLMProvider, LLMResponse, CompletionOptions } from '../interfaces/llm-provider.interface';
import { GoogleGenAI } from '@google/genai'; 

export class GeminiProvider implements LLMProvider {
  public readonly id = 'google-gemini';
  public readonly name = 'Google Gemini Cloud';
  private ai: GoogleGenAI;
  private modelName: string;
  private nairaPerDollarRate = 1600; // Tracked via config/FX engine

  constructor(apiKey: string, modelName = 'gemini-2.5-flash') {
    this.ai = new GoogleGenAI({ apiKey });
    this.modelName = modelName;
  }

  async generateCompletion(prompt: string, options?: CompletionOptions): Promise<LLMResponse> {
    try {
      const response = await this.ai.models.generateContent({
        model: this.modelName,
        contents: prompt,
        config: {
          systemInstruction: options?.systemPrompt,
          temperature: options?.temperature ?? 0.1,
          maxOutputTokens: options?.maxTokens,
          responseMimeType: options?.jsonMode ? 'application/json' : 'text/plain',
        }
      });

      const text = response.text;
      if (!text) throw new Error('Empty response received from Gemini API');

      // Note: Official token counters should map to the native SDK computeMetadata
      const promptTokens = response.usageMetadata?.promptTokenCount ?? 0;
      const completionTokens = response.usageMetadata?.candidatesTokenCount ?? 0;
      
      // Unit Economics Calculation based on $0.002 per 1k tokens baseline
      const costUSD = ((promptTokens + completionTokens) / 1000) * 0.002;
      
      return {
        content: text,
        modelIdentifier: this.modelName,
        usage: {
          promptTokens,
          completionTokens,
          totalTokens: promptTokens + completionTokens,
          estimatedCostNaira: costUSD * this.nairaPerDollarRate
        }
      };
    } catch (error) {
      throw new Error(`Gemini Execution Failure: ${(error as Error).message}`);
    }
  }

  async estimateTokens(text: string): Promise<number> {
    const countResponse = await this.ai.models.countTokens({
      model: this.modelName,
      contents: text,
    });
    return countResponse.totalTokens;
  }
}

```

#### Local Ollama Adapter (FX & Operational Continuity Hedge)

```typescript
// src/core/llm/adapters/ollama.adapter.ts
import { LLMProvider, LLMResponse, CompletionOptions } from '../interfaces/llm-provider.interface';
import axios from 'axios';

export class OllamaProvider implements LLMProvider {
  public readonly id = 'local-ollama';
  public readonly name = 'Local Ollama Engine';
  private endpoint: string;
  private modelName: string;

  constructor(endpoint = 'http://localhost:11434', modelName = 'qwen2.5-coder:7b') {
    this.endpoint = endpoint;
    this.modelName = modelName;
  }

  async generateCompletion(prompt: string, options?: CompletionOptions): Promise<LLMResponse> {
    const payload = {
      model: this.modelName,
      prompt: prompt,
      system: options?.systemPrompt,
      stream: false,
      options: {
        temperature: options?.temperature ?? 0.1,
        num_predict: options?.maxTokens
      },
      format: options?.jsonMode ? 'json' : undefined
    };

    const response = await axios.post(`${this.endpoint}/api/generate`, payload);
    const data = response.data;

    // Local models run at zero marginal API billing cost
    const promptTokens = data.prompt_eval_count ?? 0;
    const completionTokens = data.eval_count ?? 0;

    return {
      content: data.response,
      modelIdentifier: `local:${this.modelName}`,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
        estimatedCostNaira: 0 
      }
    };
  }

  async estimateTokens(text: string): Promise<number> {
    // Structural approximation calculation string representation for local token scaling
    return Math.ceil(text.length / 4);
  }
}

```

### 1.3 Execution Fallback Layer Orchestrator

```typescript
// src/core/llm/llm.manager.ts
import { LLMProvider, LLMResponse, CompletionOptions } from './interfaces/llm-provider.interface';

export class LLMManager {
  private providers: Map<string, LLMProvider> = new Map();
  private primaryProviderId = 'google-gemini';
  private fallbackProviderId = 'local-ollama';

  registerProvider(provider: LLMProvider) {
    this.providers.set(provider.id, provider);
  }

  setPrimaryProvider(id: string) {
    this.primaryProviderId = id;
  }

  async execute(prompt: string, options?: CompletionOptions): Promise<LLMResponse> {
    const primary = this.providers.get(this.primaryProviderId);
    
    if (!primary) {
      throw new Error(`Primary execution engine matching ID "${this.primaryProviderId}" is unconfigured.`);
    }

    try {
      // Execute via Cloud Base Option
      return await primary.generateCompletion(prompt, options);
    } catch (cloudError) {
      console.warn(`⚠️ Cloud Generation Pipeline Interrupted. Engaging local fallback routine...`);
      
      const fallback = this.providers.get(this.fallbackProviderId);
      if (!fallback) {
        throw new Error(`Execution Pipeline Collapsed: Secondary engine "${this.fallbackProviderId}" inaccessible.`);
      }
      
      return await fallback.generateCompletion(prompt, options);
    }
  }
}

```

---

## 2. "Chat-to-Spec" Wizard Prompt Engineering Matrix

To close the behavior gap found in software environments where requirements live exclusively as unstructured logs (WhatsApp text briefs, voice notes, raw comments), the NijaSpec CLI executes a sequential, deterministic multi-stage parsing loop.

```
       [INPUT STRUCTURE]
Unstructured requirements log (WhatsApp, Figma, Notes)
               │
               ▼
   ┌───────────────────────┐
   │ Phase 1: Structuring  │ ──► Extracts Schemas & Domain Elements
   └───────────────────────┘
               │
               ▼
   ┌───────────────────────┐
   │ Phase 2: Compression  │ ──► Enforces Zero-Fluff Standard & Mocks Local Gateways
   └───────────────────────┘
               │
               ▼
       [OUTPUT ARTIFACT]
 Canonical NijaSpec Markdown System File (`nijaspec.md`)

```

### 2.1 Matrix Definition Table

| Phase | Input Profile | System Prompt Strategy Blueprint | Output Constraints | Target Artifact |
| --- | --- | --- | --- | --- |
| **1. Entity Parsing & Extraction** | Raw text fragments, colloquial transcripts, manual webhook briefs. | Extract strict operational domain items: Route signatures, parameters, validation targets, auth types. Ignore structural conversational conversational noise. | Pure Valid JSON mapping out basic routes, parameters, status codes. | `intermediate_schema.json` |
| **2. NijaSpec Standardization** | `intermediate_schema.json` from Phase 1. | Map structural components directly to NijaSpec Markdown standards. Inject localized Paystack/Flutterwave webhook signature validations automatically. | Tight, markdown schema with zero prose, summary blocks, or structural notes. | `nijaspec.md` |

### 2.2 System Prompts

#### System Prompt: Phase 1 — Structural Object Mapping

```
You are an expert system backend systems architect operating as a specialized JSON parser. Your task is to process highly raw, unstructured, conversational software requirements (e.g., transcripts, voice note logs, slack notes) and project them into an operational domain map.

### Data Extraction Protocol:
1. REST Endpoints: Identify relative path, HTTP Method verb, and target actions.
2. Context Mapping: Deduce expected request headers, payloads, query parameters.
3. Response Schemas: Map baseline success criteria alongside expected error boundaries (e.g., 400 Bad Request, 401 Unauthorized).
4. Local Gateway Hooks: Identify explicitly if the input references local third-party providers such as Paystack, Flutterwave, or Monnify payment flows.

### Constraint Boundaries:
- Do not make assumptions regarding business rules not found in the input logs.
- If a method data type is ambiguous, default parsing behavior to string.
- Your output must be entirely parseable JSON. Do not include any markdown styling syntax wrap, commentary, or tracking logs.

### Response Template Format:
{
  "endpoints": [
    {
      "path": "/api/v1/checkout",
      "method": "POST",
      "auth": "Bearer",
      "request": {
        "headers": [],
        "body": {}
      },
      "responses": [
        { "status": 200, "body": {} }
      ],
      "isFintechGateway": true,
      "gatewayProvider": "Paystack"
    }
  ]
}

```

#### System Prompt: Phase 2 — NijaSpec Standardization Engine

```
You are an engineering orchestration compilation engine. Your role is to convert a structural architectural JSON object schema into an optimized, deployment-ready NijaSpec Canonical Markdown Specification file.

### Formatting Rules:
1. Output format must exclusively use clean, flat Markdown headers and syntax.
2. Do not wrap code snippets in conversational text blocks, greetings, or implementation guides.
3. Eliminate all human-readable explanatory prose, descriptions, or commentary. Keep parameters tight and structured.

### Injection Mandates for Localized Fintech Gateways:
If an endpoint flag marks `isFintechGateway: true`, you must automatically insert signature-level webhook validation specs directly into the payload structural definitions:
- For Paystack: Enforce header tracking targeting `x-paystack-signature`.
- For Flutterwave: Enforce header validation mapping `verif-hash`.
Include explicit mocking expectations for verification routes to protect downstream integration flows against payment validation drops and silent drift failures.

### Canonical Specification Target Structure:
# NijaSpec API Layout
## Endpoint: [METHOD] [Path]
- Auth: [Authentication Type Target]
- Headers:
  - [Key]: [Type] (e.g., x-paystack-signature: string)
- Payload Structure:
  ```json
  [Compressed Key-Value Blueprint]

```

* Response:
* Code: [Status Code]
* Structure:
```json
[Compressed Key-Value Blueprint]

```





```

---

## 3. GitHub Action Automated Pipeline Layer

To bypass local machine environment configuration differences and establish verifiable deployment gatekeeping, the automated test workflow runs directly in an isolated pipeline container on every single `push` or `pull_request` event.


```

```
              [ DEVELOPER GIT PUSH ]
                        │
                        ▼
           ┌────────────────────────┐
           │ GitHub Actions Runner  │
           └────────────────────────┘
                        │
          ┌─────────────┴─────────────┐
          ▼                           ▼
┌───────────────────┐       ┌───────────────────┐
│ Environment Setup │       │ Cache Management  │
└───────────────────┘       └───────────────────┘
          │                           │
          └─────────────┬─────────────┘
                        │
                        ▼
           ┌────────────────────────┐
           │  NijaSpec Diagnostics  │
           ├────────────────────────┤
           │ • Token Price Tracker  │
           │ • Multi-Engine Run     │
           └────────────────────────┘
                        │
                        ▼
           ┌────────────────────────┐
           │   Self-Healing Cycle   │
           ├────────────────────────┤
           │  Runs tests via Jest   │
           │  Catches execution code│
           │  Automatic LLM Patch   │
           └────────────────────────┘
                        │
          ┌─────────────┴─────────────┐
          ▼                           ▼
[ SUCCESS: Merges Repo ]    [ FAILURE: Halts PR Run ]

```

```

### 3.1 Directory Structure Placement
The automated workflow file should be located at the root of your project repository:
`{workspace}/.github/workflows/nijaspec-ci.yml`

### 3.2 Workflow Automation Blueprint

```yaml
# .github/workflows/nijaspec-ci.yml
name: NijaSpec Architectural Alignment Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

permissions:
  contents: write    # Permission scope allowed to update the repository for self-healing patches
  pull-requests: write

jobs:
  validate-spec:
    name: Execute Specification Audit Run
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Initialize Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'

      - name: Install System Dependencies
        run: |
          npm ci
          # Global automated injection tools needed for structural lint checking
          npm install -g jest supertest

      - name: Execute Token Volatility Estimation
        id: cost-gate
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
        run: |
          echo "=== Commencing Local Token Usage Cost Analysis ==="
          # Triggers internal cost calculator before executing standard generation loops
          node dist/cli.js estimate --spec ./nijaspec.md --threshold 15000

      - name: Execute NijaSpec Alignment Generator
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
        run: |
          echo "=== Transforming Markdown Specifications to Dynamic Jest Spec Scaffolding ==="
          node dist/cli.js generate --input ./nijaspec.md --output ./tests/nijaspec.spec.js --framework jest

      - name: Run Verification Engine & Self-Healing Patch Loop
        id: self-healing-runner
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
        run: |
          echo "=== Initiating Test Execution Matrix Pipeline ==="
          
          # Internal execution command pass designed to monitor automated test runner states
          MAX_ATTEMPTS=2
          ATTEMPT=1
          SUCCESS=false

          while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
            echo "Execution Iteration Run: [ $ATTEMPT / $MAX_ATTEMPTS ]"
            
            # Catch stdout error blocks directly to evaluate internal pipeline states
            if npx jest ./tests/nijaspec.spec.js --json --outputFile=jest-results.json; then
              echo "✅ Specification Verification Cleared: Codebase structurally matches target artifact."
              SUCCESS=true
              break
            else
              echo "⚠️ Test execution failed or caught syntax discrepancies in LLM-generated scaffold."
              if [ $ATTEMPT -lt $MAX_ATTEMPTS ]; then
                echo "🚀 Dispatching execution failure dump payload back to NijaSpec self-healing model engine..."
                node dist/cli.js heal --spec ./nijaspec.md --testFile ./tests/nijaspec.spec.js --errorLog ./jest-results.json
              fi
            fi
            ATTEMPT=$((ATTEMPT+1))
          done

          if [ "$SUCCESS" = false ]; then
            echo "❌ Architectural Alignment Breached: Code generation engine failed to resolve code validation constraints."
            exit 1
          fi

      - name: Commit Corrected Test Scaffolding
        if: github.event_name == 'pull_request' && always()
        run: |
          git config --local user.email "orchestrator@nijaspec.io"
          git config --local user.name "NijaSpec Automation Engine"
          git add ./tests/nijaspec.spec.js
          if ! git diff --cached --quiet; then
            git commit -m "chore(nijaspec): automatic self-healing sync alignment patch applied"
            git push origin HEAD:${{ github.head_ref }}
          else
            echo "Zero architectural alignment alterations recorded."
          fi

```

---

## 4. Operational & Implementation Debt Log

Track the following critical implementation tasks as you build out this foundation:

* [ ] **Adapter Resilience Testing:** Verify that the `LLMManager` intercepts a simulated `503 Service Unavailable` cloud network drop and completely falls back to local `Ollama` execution paths seamlessly.
* [ ] **Prompt Token Minimizer:** Refine the Pre-Parser utility logic to remove all markdown formatting characters, line breaks, and emojis from specs prior to transmission to maximize token optimization.
* [ ] **Legal Scaffold Injection:** Hardcode the disclaimer metadata headers (`# ⚠️ Generated by NijaSpec...`) into all generated file templates to eliminate upstream legal compliance liability.

```

```

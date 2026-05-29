# Plan: Fix TypeScript Errors in nija-audit

## Goal
Resolve TypeScript errors `TS2591` (missing node types) and `TS2345` (type mismatch for `ast`) when running `npm run check`.

## Analysis
1. **Missing Node Types (`TS2591`)**:
    - `@types/node` is present in `dependencies`, but not in `devDependencies`.
    - `tsconfig.json` does not explicitly include `node` in `compilerOptions.types`.
    - `tsconfig.json` `include` only covers `src/**/*`, but the entry point `bin/nija.ts` is outside this directory. This may lead to `ts-node` or `tsc` not applying the full project context or type definitions to files in `bin/`.

2. **Type Mismatch for `ast` (`TS2345`)**:
    - `MdParser.parse` returns `ParseResult` where `ast` is `string[] | null`.
    - In `bin/nija.ts`, there is a null check `if (!ast) { process.exit(1); }`, which should narrow the type to `string[]`.
    - However, the compiler is still reporting that `string[] | null` is not assignable to `string[]`. This could be due to the specific TypeScript version or a compiler quirk.

## Proposed Fixes

### 1. Node Types Fix
- **Update `tsconfig.json`**:
    - Add `"bin/**/*"` to the `include` array to ensure files in `bin/` are treated as part of the project.
    - Add `"types": ["node"]` to `compilerOptions` to explicitly load Node.js type definitions.
- **Update `package.json`**:
    - Move `@types/node` from `dependencies` to `devDependencies`.

### 2. `ast` Type Mismatch Fix
- **Update `bin/nija.ts`**:
    - Use a non-null assertion operator (`ast!`) or a type cast (`ast as string[]`) when calling `HeaderValidator.validate(ast)` to satisfy the compiler, as the null check already ensures `ast` is not null.

## Implementation Steps
1. [ ] Update `package.json` to move `@types/node` to `devDependencies`.
2. [ ] Update `tsconfig.json` to include `bin/**/*` and add `types: ["node"]`.
3. [ ] Update `bin/nija.ts` to use non-null assertion for `ast` in `HeaderValidator.validate`.
4. [ ] Verify the fix by running `npm run check -- test-spec.md`.

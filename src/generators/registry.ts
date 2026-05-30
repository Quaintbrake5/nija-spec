import { Generator } from './interface';

const registry = new Map<string, Generator>();

export function registerGenerator(generator: Generator): void {
  const key = `${generator.language}-${generator.framework}`;
  registry.set(key, generator);
}

export function getGenerator(language: string, framework: string): Generator | undefined {
  return registry.get(`${language}-${framework}`);
}

export function listGenerators(): Generator[] {
  return Array.from(registry.values());
}

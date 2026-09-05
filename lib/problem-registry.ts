import generatedProblemRegistry from "../data/problem-registry.json";

interface ProblemRegistryEntry {
  slug: string;
  active: boolean;
}

export interface ProblemRegistry {
  version: 1;
  problems: ProblemRegistryEntry[];
}

export const committedProblemRegistry = generatedProblemRegistry as ProblemRegistry;

const compareSlugs = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

export function validateProblemRegistry(registry: ProblemRegistry): void {
  if (registry.version !== 1) {
    throw new Error(`Unsupported Problem Registry version: ${String(registry.version)}`);
  }
  if (!Array.isArray(registry.problems)) {
    throw new Error("Problem Registry must contain a problems array");
  }

  const seen = new Set<string>();
  let previousSlug = "";

  for (const entry of registry.problems) {
    if (typeof entry.slug !== "string" || entry.slug.length === 0) {
      throw new Error("Problem Registry entries must have a non-empty slug");
    }
    if (typeof entry.active !== "boolean") {
      throw new Error(`Problem Registry entry ${entry.slug} must have a boolean active flag`);
    }
    if (seen.has(entry.slug)) {
      throw new Error(`Problem Registry contains duplicate slug: ${entry.slug}`);
    }
    if (previousSlug && compareSlugs(entry.slug, previousSlug) < 0) {
      throw new Error("Problem Registry entries must be sorted by slug");
    }

    seen.add(entry.slug);
    previousSlug = entry.slug;
  }
}

validateProblemRegistry(committedProblemRegistry);

export function assertProblemRegistryRetains(
  previous: ProblemRegistry | null,
  next: ProblemRegistry
): void {
  if (!previous) return;
  validateProblemRegistry(previous);
  validateProblemRegistry(next);

  const retained = new Map(next.problems.map((entry) => [entry.slug, entry]));
  for (const entry of previous.problems) {
    const nextEntry = retained.get(entry.slug);
    if (!nextEntry || typeof nextEntry.active !== "boolean") {
      throw new Error(`Problem Registry dropped previously registered slug: ${entry.slug}`);
    }
  }
}

export function updateProblemRegistry(
  previous: ProblemRegistry | null,
  currentSlugs: Iterable<string>
): ProblemRegistry {
  if (previous) validateProblemRegistry(previous);

  const current = new Set<string>();
  for (const slug of currentSlugs) {
    if (typeof slug !== "string" || slug.length === 0) {
      throw new Error("Problem Registry cannot contain an empty slug");
    }
    current.add(slug);
  }

  const entries = new Map<string, ProblemRegistryEntry>();
  for (const entry of previous?.problems ?? []) {
    entries.set(entry.slug, { ...entry });
  }

  for (const slug of current) {
    entries.set(slug, { slug, active: true });
  }

  for (const entry of entries.values()) {
    if (!current.has(entry.slug)) entry.active = false;
  }

  const registry: ProblemRegistry = {
    version: 1,
    problems: Array.from(entries.values()).sort((a, b) => compareSlugs(a.slug, b.slug)),
  };
  validateProblemRegistry(registry);
  return registry;
}

export function isRegisteredProblemSlug(registry: ProblemRegistry, slug: string): boolean {
  return registry.problems.some((entry) => entry.slug === slug);
}

export function isValidProblemRegistrySlug(
  slug: unknown,
  registry: ProblemRegistry = committedProblemRegistry
): slug is string {
  return typeof slug === "string" && isRegisteredProblemSlug(registry, slug);
}

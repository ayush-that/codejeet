import { learningData, type LearningDataFacade } from "../../lib/learning-data/facade";

type MemoryStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
  key(index: number): string | null;
  readonly length: number;
};

export interface LearningDataBrowserFixture {
  learnerId: string;
  problemSlug: string;
  requests: Array<{ url: string; method: string; body?: string }>;
  storage: MemoryStorage;
  facade: LearningDataFacade;
  restore: () => void;
}

export function createLearningDataBrowserFixture(): LearningDataBrowserFixture {
  const values = new Map<string, string>();
  const storage: MemoryStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
    clear: () => values.clear(),
    key: (index) => [...values.keys()][index] ?? null,
    get length() {
      return values.size;
    },
  };
  const requests: LearningDataBrowserFixture["requests"] = [];
  const previousWindow = (globalThis as { window?: unknown }).window;
  const previousStorage = (globalThis as { localStorage?: unknown }).localStorage;
  const previousFetch = globalThis.fetch;

  (globalThis as { window?: unknown }).window = globalThis;
  (globalThis as { localStorage?: MemoryStorage }).localStorage = storage;
  globalThis.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    const method = init?.method ?? "GET";
    const body = typeof init?.body === "string" ? init.body : undefined;
    requests.push({ url, method, ...(body === undefined ? {} : { body }) });

    if (url === "/api/progress" && method === "GET") {
      return Response.json({ progress: {} });
    }
    if (url === "/api/notes" && method === "GET") {
      return Response.json({ notes: {}, updatedAt: {} });
    }
    return Response.json({ ok: true });
  };

  return {
    learnerId: "fixture-learner",
    problemSlug: "two-sum",
    requests,
    storage,
    facade: learningData,
    restore: () => {
      if (previousWindow === undefined) {
        delete (globalThis as { window?: unknown }).window;
      } else {
        (globalThis as { window?: unknown }).window = previousWindow;
      }
      if (previousStorage === undefined) {
        delete (globalThis as { localStorage?: unknown }).localStorage;
      } else {
        (globalThis as { localStorage?: unknown }).localStorage = previousStorage;
      }
      globalThis.fetch = previousFetch;
    },
  };
}

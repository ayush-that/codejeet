import { CACHE_VERSION } from "@/lib/cache-version";
import { decodeDashboardPayload, type DashboardIndex } from "@/lib/dashboard/decode";
import type { DashboardPayload } from "@/lib/dashboard/schema";

const CACHE_PREFIX = "dashboard-cache-";
const CACHE_KEY = `${CACHE_PREFIX}${CACHE_VERSION}`;
const FETCH_TIMEOUT_MS = 15000;

export interface DashboardStore {
  data: DashboardIndex | null;
  loading: boolean;
  error: string | null;
}

let store: DashboardStore = { data: null, loading: true, error: null };
const listeners = new Set<() => void>();
let started = false;
// Bumped on every load() call so a stale, late-resolving request can't clobber
// a newer one's result (e.g. a slow failing request finishing after a retry succeeded).
let generation = 0;

function emit() {
  listeners.forEach((listener) => listener());
}

function setStore(next: DashboardStore) {
  store = next;
  emit();
}

// A pre-v5 entry could be several megabytes and would block the new write.
function dropStaleCaches() {
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX) && key !== CACHE_KEY) {
        localStorage.removeItem(key);
      }
    }
  } catch {}
}

function readCache(): DashboardIndex | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const payload = JSON.parse(cached) as DashboardPayload;
    if (payload?.v !== 2 || !Array.isArray(payload.links)) throw new Error("bad shape");
    return decodeDashboardPayload(payload);
  } catch {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch {}
    return null;
  }
}

function load() {
  const mine = ++generation;
  dropStaleCaches();

  const cached = readCache();
  if (cached) {
    setStore({ data: cached, loading: false, error: null });
    return;
  }

  setStore({ data: null, loading: true, error: null });

  fetch("/data/dashboard.json", { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    })
    .then((text) => {
      // Cache the raw text so nothing is stringified twice.
      const index = decodeDashboardPayload(JSON.parse(text) as DashboardPayload);
      try {
        localStorage.setItem(CACHE_KEY, text);
      } catch {}
      if (mine !== generation) return;
      setStore({ data: index, loading: false, error: null });
    })
    .catch((err: unknown) => {
      if (mine !== generation) return;
      const timedOut = err instanceof Error && err.name === "TimeoutError";
      setStore({
        data: null,
        loading: false,
        error: timedOut
          ? "That took too long. Check your connection."
          : "Could not load questions.",
      });
    });
}

export function retryDashboard() {
  load();
}

export function subscribeToDashboard(callback: () => void): () => void {
  listeners.add(callback);
  if (!started) {
    started = true;
    load();
  }
  return () => {
    listeners.delete(callback);
  };
}

export function getDashboardSnapshot(): DashboardStore {
  return store;
}

// ponytail: stable reference — a fresh object each call makes useSyncExternalStore loop forever.
const serverSnapshot: DashboardStore = { data: null, loading: true, error: null };
export function getDashboardServerSnapshot(): DashboardStore {
  return serverSnapshot;
}

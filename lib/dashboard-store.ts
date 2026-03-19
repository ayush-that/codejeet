import { CACHE_VERSION } from "@/lib/cache-version";
import type { Question } from "@/components/LeetCodeDashboard";

interface DashboardData {
  questions: Question[];
  companies: string[];
}

interface DashboardStore {
  data: DashboardData | null;
  loading: boolean;
}

let store: DashboardStore = { data: null, loading: true };
const listeners = new Set<() => void>();
let fetchStarted = false;

function emit() {
  listeners.forEach((l) => l());
}

function getCachedData(): DashboardData | null {
  try {
    const cached = localStorage.getItem(`dashboard-cache-${CACHE_VERSION}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && Array.isArray(parsed.questions) && Array.isArray(parsed.companies)) {
        return parsed;
      }
    }
  } catch {}
  return null;
}

function startFetch() {
  if (fetchStarted) return;
  fetchStarted = true;

  const cached = getCachedData();
  if (cached) {
    store = { data: cached, loading: false };
    emit();
    return;
  }

  fetch("/data/questions.json")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      const result: DashboardData = { questions: data.questions, companies: data.companies };
      try {
        localStorage.setItem(`dashboard-cache-${CACHE_VERSION}`, JSON.stringify(result));
      } catch {}
      store = { data: result, loading: false };
      emit();
    })
    .catch(() => {
      fetchStarted = false;
      store = { data: { questions: [], companies: [] }, loading: false };
      emit();
    });
}

export function subscribeToDashboard(callback: () => void): () => void {
  listeners.add(callback);
  startFetch();
  return () => {
    listeners.delete(callback);
  };
}

export function getDashboardSnapshot(): DashboardStore {
  return store;
}

export function getDashboardServerSnapshot(): DashboardStore {
  return { data: null, loading: true };
}

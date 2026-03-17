interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
}

interface BlogStore {
  posts: BlogPost[];
  loading: boolean;
}

let store: BlogStore = { posts: [], loading: true };
const listeners = new Set<() => void>();
let fetchStarted = false;

function emit() {
  listeners.forEach((l) => l());
}

function startFetch() {
  if (fetchStarted) return;
  fetchStarted = true;

  fetch("/data/blog-index.json")
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then((data: BlogPost[]) => {
      store = { posts: data, loading: false };
      emit();
    })
    .catch(() => {
      store = { posts: [], loading: false };
      emit();
    });
}

export function subscribeToBlog(callback: () => void): () => void {
  listeners.add(callback);
  startFetch();
  return () => {
    listeners.delete(callback);
  };
}

export function getBlogSnapshot(): BlogStore {
  return store;
}

export function getBlogServerSnapshot(): BlogStore {
  return { posts: [], loading: true };
}

// Progress sync for signed-in users.
// Signed-out users keep using localStorage ("leetcode-checked-items") as before;
// this layer is purely additive on top of that.

const LOCAL_KEY = "leetcode-checked-items";

// slug -> ISO solve timestamp
export type ProgressMap = Record<string, string>;

export async function fetchUserProgress(): Promise<ProgressMap> {
  try {
    const res = await fetch("/api/progress");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.progress || {};
  } catch (error) {
    console.error("fetchUserProgress failed:", error);
    return {};
  }
}

export async function updateQuestionProgress(slug: string, completed: boolean): Promise<boolean> {
  try {
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, completed }),
    });
    return res.ok;
  } catch (error) {
    console.error("updateQuestionProgress failed:", error);
    return false;
  }
}

export function getLocalProgress(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (!saved) return {};
    const parsed = JSON.parse(saved);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    localStorage.removeItem(LOCAL_KEY);
    return {};
  }
}

export function saveLocalProgress(progress: Record<string, boolean>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("saveLocalProgress failed:", error);
  }
}

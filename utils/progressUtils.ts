// Progress sync for signed-in users.
// Signed-out users keep using localStorage ("leetcode-checked-items") as before;
// this layer is purely additive on top of that.

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

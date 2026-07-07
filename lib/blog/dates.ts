export function clampBlogDate(rawDate: string, today: string): string {
  if (!rawDate) return today;
  return rawDate > today ? today : rawDate;
}

export function spreadBlogDates<T extends { slug: string; date: string }>(
  entries: T[],
  today: Date = new Date()
): T[] {
  const sorted = [...entries].sort((a, b) => a.slug.localeCompare(b.slug));
  const spanDays = Math.min(730, Math.max(sorted.length * 2, 30));

  for (let i = 0; i < sorted.length; i++) {
    const daysAgo = Math.floor((i / Math.max(sorted.length - 1, 1)) * spanDays);
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    sorted[i] = { ...sorted[i], date: d.toISOString().split("T")[0] };
  }

  return sorted.sort((a, b) => b.date.localeCompare(a.date));
}

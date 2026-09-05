import { getRequestEvent } from "solid-js/web";

export async function loadPublicData<T>(path: string): Promise<T> {
  const event = getRequestEvent();
  const response = await fetch(event ? new URL(path, event.request.url) : path);
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return (await response.json()) as T;
}

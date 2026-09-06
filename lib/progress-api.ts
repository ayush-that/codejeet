export interface ProgressApiDependencies {
  getUserId(): Promise<string | null>;
  listProgress(userId: string): Promise<Record<string, string>>;
  setProgress(userId: string, slug: string, completed: boolean, now: string): Promise<void>;
  now(): string;
  readOnly: boolean;
}

export async function handleProgressGet(dependencies: ProgressApiDependencies): Promise<Response> {
  const userId = await dependencies.getUserId();
  if (!userId) return Response.json({ progress: {} });

  return Response.json({ progress: await dependencies.listProgress(userId) });
}

export async function handleProgressPost(
  request: Request,
  dependencies: ProgressApiDependencies
): Promise<Response> {
  const userId = await dependencies.getUserId();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  if (dependencies.readOnly) {
    return new Response("User data is temporarily read-only", {
      status: 503,
      headers: { "Retry-After": "60" },
    });
  }

  let body: { slug?: unknown; completed?: unknown };
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { slug, completed } = body;
  if (typeof slug !== "string" || slug.length === 0 || slug.length > 256) {
    return new Response("Invalid slug", { status: 400 });
  }

  await dependencies.setProgress(userId, slug, Boolean(completed), dependencies.now());
  return Response.json({ ok: true });
}

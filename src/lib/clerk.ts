import type { Clerk } from "@clerk/clerk-js";

let instance: Clerk | undefined;
let loading: Promise<Clerk | null> | undefined;

function publishableKey(): string | undefined {
  const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  return typeof key === "string" && key.length > 0 ? key : undefined;
}

export function getClerk(): Promise<Clerk | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (loading) return loading;
  const key = publishableKey();
  if (!key) return Promise.resolve(null);
  loading = import("@clerk/clerk-js").then(async ({ Clerk }) => {
    instance ??= new Clerk(key);
    await instance.load();
    return instance;
  });
  return loading;
}

export async function getClerkSessionToken(): Promise<string | null> {
  const clerk = await getClerk();
  return clerk?.session?.getToken() ?? null;
}

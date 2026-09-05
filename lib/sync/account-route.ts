const HMAC = "HMAC";
const HMAC_HASH = "SHA-256";
const UTF8 = new TextEncoder();
const ROUTE_PREFIX = "cjet-v1-";
const ROUTE_DIGEST_LENGTH = 43;
const ROUTE_PATTERN = new RegExp(`^${ROUTE_PREFIX}[A-Za-z0-9_-]{${ROUTE_DIGEST_LENGTH}}$`);

function base64Url(value: Uint8Array): string {
  let text = "";
  for (const byte of value) text += String.fromCharCode(byte);
  return btoa(text).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

export async function accountRouteName(secret: string, accountId: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    UTF8.encode(secret),
    { name: HMAC, hash: HMAC_HASH },
    false,
    ["sign"]
  );
  const digest = new Uint8Array(await crypto.subtle.sign(HMAC, key, UTF8.encode(accountId)));
  return `${ROUTE_PREFIX}${base64Url(digest)}`;
}

export function isAccountRouteName(value: unknown): value is string {
  return typeof value === "string" && ROUTE_PATTERN.test(value);
}

export function assertAccountRouteName(value: string): string {
  if (!isAccountRouteName(value)) throw new Error("account route key is invalid");
  return value;
}

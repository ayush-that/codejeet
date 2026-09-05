import {
  checkRevocationHandle,
  consumeRevocationRateLimit,
  type AccountDeletionEnvironment,
} from "@/lib/sync/account-deletion";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = "force-dynamic";

const HANDLE_BYTES = 32;
const MAX_REQUEST_BYTES = HANDLE_BYTES;

async function readFixedBytes(request: Request): Promise<Uint8Array | null> {
  if (!request.body) return null;
  const reader = request.body.getReader();
  const result = new Uint8Array(MAX_REQUEST_BYTES);
  let offset = 0;
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    if (offset + chunk.value.byteLength > MAX_REQUEST_BYTES) {
      await reader.cancel();
      return null;
    }
    result.set(chunk.value, offset);
    offset += chunk.value.byteLength;
  }
  return offset === HANDLE_BYTES ? result : null;
}

function clientAddress(request: Request): string {
  return request.headers.get("cf-connecting-ip")?.slice(0, 128) || "anonymous";
}

export async function POST(request: Request): Promise<Response> {
  const { env } = getCloudflareContext();
  if (!env.DB || !env.SYNC_HMAC_SECRET) return new Response(null, { status: 503 });
  try {
    if (
      !(await consumeRevocationRateLimit(
        { DB: env.DB } satisfies AccountDeletionEnvironment,
        env.SYNC_HMAC_SECRET,
        clientAddress(request)
      ))
    )
      return new Response(null, { status: 429 });
  } catch {
    return new Response(null, { status: 503 });
  }
  const length = request.headers.get("content-length");
  if (length !== null && (!/^\d+$/.test(length) || Number(length) > MAX_REQUEST_BYTES)) {
    return new Response(null, { status: 400 });
  }
  const handle = await readFixedBytes(request);
  if (!handle) return new Response(null, { status: 400 });
  const status = await checkRevocationHandle(
    { DB: env.DB } satisfies AccountDeletionEnvironment,
    handle
  );
  return Response.json(status, { headers: { "cache-control": "no-store" } });
}

import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { NextRequest } from "next/server";
import { accountRouteName } from "@/lib/sync/account-route";
import { handleClerkUserDeletedWebhook } from "@/lib/sync/account-deletion";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  const { env } = getCloudflareContext();
  if (!env.CLERK_WEBHOOK_SIGNING_SECRET || !env.SYNC_HMAC_SECRET) {
    return new Response(null, { status: 503 });
  }
  return handleClerkUserDeletedWebhook(
    request,
    async (accountId) => {
      const route = await accountRouteName(env.SYNC_HMAC_SECRET, accountId);
      const account = env.ACCOUNT_DATA.getByName(route);
      await account.deleteAccount(accountId, route);
    },
    (incoming) =>
      verifyWebhook(incoming as NextRequest, {
        signingSecret: env.CLERK_WEBHOOK_SIGNING_SECRET,
      })
  );
}

declare module "*.open-next/worker.js" {
  const handler: {
    fetch(request: Request, env: CloudflareEnv, ctx: ExecutionContext): Promise<Response>;
  };

  export default handler;
}

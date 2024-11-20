import { api } from "../_generated/api";
import { ActionCtx, httpAction } from "../_generated/server";

export const getPackagesHTTPHandler = httpAction(async (ctx, request) => {
  const packages = await ctx.runQuery(api.queries.packageTable.getPackagesMetadata, {});
  return new Response(JSON.stringify(packages), { status: 200 });
});
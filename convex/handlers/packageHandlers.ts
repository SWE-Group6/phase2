import { api } from "../_generated/api";
import { ActionCtx, httpAction } from "../_generated/server";

export const getPackagesHTTPHandler = httpAction(async (ctx, request) => {
  const packages = await ctx.runQuery(api.queries.packageTable.getPackages, {});
  //only return the metadata
  const packagesMetadata = packages.map((pkg: any) => pkg.metadata);
  return new Response(JSON.stringify(packagesMetadata), { status: 200 });
});
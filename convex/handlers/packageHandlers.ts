import { api } from "../_generated/api";
import { ActionCtx, httpAction } from "../_generated/server";

export const getPackagesHTTPHandler = httpAction(async (ctx, request) => {
  // get the offset parameter from the request and then use that to paginate the response. In the response, also return the next offset in the response headers
  const url = new URL(request.url);
  const offset = url.searchParams.get("offset") || null;
  console.log('offset:', offset);
  const limit = 2;
  const result = await ctx.runQuery(api.queries.packageTable.getPackagesMetadata, {paginationOpts: {numItems: limit, cursor: offset }, });
  const nextOffset = result.cursor; // Cursor for the next page
  console.log('nextOffset:', nextOffset);
  const headers = new Headers();
  if (nextOffset) {
    headers.set("offset", nextOffset);
  }
  console.log("Headers:", headers);
  return new Response(JSON.stringify(result.packagesData), { status: 200, headers });
});
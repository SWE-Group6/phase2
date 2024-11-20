import { api } from "../_generated/api";
import { httpAction} from "../_generated/server";


export const getPackageByIdHTTPHandler = httpAction(async (ctx, request) => {
  const url = new URL(request.url);
  const pathParts = url.pathname.split("/"); // Split the path into parts
  const packageId = pathParts[pathParts.length - 1]; // Extract the last segment as the package ID

  if (!packageId) {
    return new Response(
      "Package ID not specified in the URL path",
      { status: 400 }
    );
  }

  try {
    // Use ctx.runQuery with the correct function reference from the generated API
    const pkg = await ctx.runQuery(api.queries.packageTable.getPackageById, { packageId });
    
    if (!pkg) {
      return new Response(`Package with ID ${packageId} not found.`, { status: 404 });
    }

    return new Response(JSON.stringify(pkg), { status: 200 });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
});
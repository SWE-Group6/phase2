import { api } from "../_generated/api";
import { ActionCtx, httpAction } from "../_generated/server";
import { Package } from "../package_rate/Models/Package"

// Function to generate a response based on the action
const generateResponse = async (action: string, pkg: any) => {
  if (action === 'rate') {
    const packageUrl = pkg["data"]["URL"];
    if (!packageUrl) {
      console.log('URL not found. Package is a manual upload.');
      return new Response(`URL not found. Package is a manual upload.`, { status: 404 });
    }
    const metricsPackage = new Package(packageUrl); // Assuming version is optional
    try {
      const metrics = await metricsPackage.getMetrics();
      return new Response(JSON.stringify(metrics), { status: 200 });
    }
    catch (error) {
      console.error('The package rating system choked on at least one of the metrics.:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch metrics' }), { status: 500 });
    }
  } else {
    if (!pkg) {
        console.log('Package not found.');
      return new Response(`Package not found.`, { status: 404 });
    }
    return new Response(JSON.stringify(pkg), { status: 200 });
  }
}


export const getPackageByIdHTTPHandler = httpAction(async (ctx, request) => {
  const url = new URL(request.url);
  const pathParts = url.pathname.split("/"); // Split the path into parts
  const packageId = pathParts[2]; // Assuming "/package/{id}/rate"
  const action = pathParts[3]; // This should be "rate"
  console.log('packageId:', packageId);
  
  if (!packageId) {
    return new Response(
      "Package ID not specified in the URL path",
      { status: 400 }
    );
  }
  
  try {
    const pkg = await ctx.runQuery(api.queries.packageTable.getPackageById, { packageId }); // Fetch package using the query
    return await generateResponse(action, pkg); // Generate response using the new function
  } catch (error: any) {
    return new Response(error.message, { status: error.status || 404 });
  }
});

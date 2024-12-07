import { api } from "../_generated/api";
import { ActionCtx, httpAction } from "../_generated/server";
import { Package } from "../package_rate/Models/Package"

// Function to generate a response based on the action
const generateResponse = async (action: string, pkg: any) => {
  if (action === 'rate') {
    const packageUrl = pkg["data"]["URL"];
    const metrics = await ratePackage(packageUrl);
    if (metrics.error) {
      return new Response(metrics.error, { status: 500 });
    }
    return new Response(JSON.stringify(metrics), { status: 200 });
  } else {
    if (!pkg) {
      console.log('Package not found.');
      return new Response(`Package not found.`, { status: 404 });
    }
    return new Response(JSON.stringify(pkg), { status: 200 });
  }
}


export const getPackageByIdHTTPHandler = httpAction(async (ctx, request) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
      return new Response("Unauthorized", { status: 401 });
  }
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


//make a method that will handle the package rate. takes in the package url and returns the metrics
//does not have to be a httpAction
export const ratePackage = async (packageUrl: string) => {
  if (!packageUrl) {
    console.log('URL not found. Package is a manual upload.');
    return { error: 'URL not found. Package is a manual upload.' };
  }
  const metricsPackage = new Package(packageUrl); // Assuming version is optional
  try {
    const metrics = await metricsPackage.getMetrics();
    return metrics;
  }
  catch (error) {
    console.error('The package rating system choked on at least one of the metrics.:', error);
    return { error: 'Failed to fetch metrics' };
  }
}
import { api } from "../_generated/api";
import { ActionCtx, httpAction } from "../_generated/server";

export const getPackagesHTTPHandler = httpAction(async (ctx, request) => {
  const packages = await ctx.runQuery(api.queries.packageTable.getPackagesMetadata, {});
  return new Response(JSON.stringify(packages), { status: 200 });
});

// This handler will:
// 1. Receive the request.
// 2. Parse the input (content or URL).
// 3. Call the uploadPackage mutation.
// 4. Return the appropriate HTTP response.
export const uploadPackageHandler = httpAction(async (ctx, request) => {
	const body = await request.json(); // First, parse the JSON body.
	const { zippedPackage, linkedPackage, Name, JSProgram } = body;

	if ((zippedPackage && linkedPackage) || (!zippedPackage && !linkedPackage)) { // Second, validate the request.
		return new Response(JSON.stringify({ error: "Provide either a zipped package or a linked package, but not both." }), { status: 400 }); // Return the appropriate error code.
	}

	// Due to separation of concerns and because first two args are optional, can check source (content or URL) in actual mutation.
	const result = await ctx.runMutation(api.mutations.uploadPackage, { 
		zippedPackage,
		linkedPackage,
		Name,
		JSProgram,
	}); // Third, call the mutation.

	return new Response(JSON.stringify(result), { status: 201 }); // Appropriate response from .yaml file
	// TODO: Account for other status codes.
});

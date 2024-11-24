import { api } from "../_generated/api";
import { ActionCtx, httpAction } from "../_generated/server";

export const getPackagesHTTPHandler = httpAction(async (ctx, request) => {
  // get the offset parameter from the request and then use that to paginate the response. In the response, also return the next offset in the response headers
  const url = new URL(request.url);
  const offset = url.searchParams.get("offset") || null;
  console.log('offset:', offset);
  const limit = 5;
  //fetch the request body for the Name and Version filter strings
  const body = await request.json();
  console.log('Body:', body);
  const NameString = body.Name;
  const VersionString = body.Version;
  console.log('Name:', NameString);
  console.log('Version:', VersionString);
  //check if the Name and Version filter strings are empty and create the filters object accordingly
  let filters: any = {};
  if (NameString) {
    filters.Name = NameString;

  }
  if (VersionString) {
    filters.Version = VersionString;
  }
  console.log('Filters:', filters);
  const result = await ctx.runQuery(api.queries.packageTable.getPackagesMetadata, {paginationOpts: {numItems: limit, cursor: offset }, filters});
  const nextOffset = result.cursor; // Cursor for the next page
  console.log('nextOffset:', nextOffset);
  const headers = new Headers();
  if (nextOffset) {
    headers.set("offset", nextOffset);
  }
  console.log("Headers:", headers);
  return new Response(JSON.stringify(result.packagesData), { status: 200, headers });
});

// This handler will:
// 1. Receive the request.
// 2. Parse the input (content or URL).
// 3. Call the uploadPackage mutation.
// 4. Return the appropriate HTTP response.
export const uploadPackageHandler = httpAction(async (ctx, request) => {
	try {
		const body = await request.json(); // First, parse the JSON body.
		const { zippedPackage, linkedPackage, Name, JSProgram } = body;

		if ((zippedPackage && linkedPackage) || (!zippedPackage && !linkedPackage)) { // Second, validate the request.
			return new Response(JSON.stringify({ error: "Provide either a zipped package or a linked package, but not both." }), { status: 400 }); // Return the appropriate error code.
		}

		const result = await ctx.runMutation(api.mutations.uploadPackage, { 
			zippedPackage,
			linkedPackage,
			Name,
			JSProgram,
		}); // Third, call the mutation.

		if (result.conflict) {
			return new Response(
				JSON.stringify({
					error: "Package already exists.",
					metadata: result.metadata, // include existing package details.
				}),
				{ status: 409 } // Appropriate error code.
			);
		}

		return new Response(
			JSON.stringify({
				message: "Package uploaded sucessfully.",
				metadata: result.metadata,
			}),
			{ status: 201 } // Created.
		);
		// TODO: Catch error codes 424 and 403?
	} catch (error: any) {
		// Handle unexpected errors.
		return new Response(
			JSON.stringify({ error: "Internal Server Error" }),
			{ status: 500 }
		);
	}
});

  

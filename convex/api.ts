import { request } from "http";
import {ActionCtx, httpAction, internalMutation, query} from "./_generated/server";
import { Package } from "./package_rate/Models/Package"
import { v } from 'convex/values'; // Import 'v' for schema validation
import { api } from "./_generated/api"; // Import generated API



export const helloHandler = httpAction(async (ctx, request) => {
  return new Response(JSON.stringify({messsage: "Hello world!"}), {
    status: 200,
    });
});

export const packageRateHandler = httpAction(async (ctx, request) => {
    //grab the url query param from the request
    const entireUrl = new URL(request.url);
    const url = entireUrl.searchParams.get('url');

    // Print the type of url and version
    console.log('Type of URL:', typeof url);
    console.log('URL:', url);

    if (typeof url !== 'string' || !url) {
        return new Response(JSON.stringify({ error: 'Invalid or missing URL in query parameters' }), {
            status: 400,
        });
    }

    try {
        const pkg = new Package(url); // Assuming version is optional
        const metrics = await pkg.getMetrics();
        
        // Send metrics as JSON
        return new Response(JSON.stringify(metrics), {
            status: 200,
        });
    } catch (error) {
        console.error('Error fetching metrics:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch metrics' }), {
            status: 500,
        });
    }
    
});


// export const getPackageById = query({
//   args: { packageId: v.id("packageTable") }, // Validate that packageId is an ID from "packageTable"
//   handler: async (ctx, args) => {
//     const pkg = await ctx.db.get(args.packageId); // Fetch the package by ID
//     if (!pkg) {
//       throw new Error(`Package with ID ${args.packageId} not found.`);
//     }
//     return pkg;
//   },
// });

export const getPackageByIdHTTPHandler = httpAction(async (ctx, request) => {
  const url = new URL(request.url);
  const packageId = url.searchParams.get("id") ?? request.headers.get("id") ?? null;

  if (packageId === null) {
    return new Response(
      "Did not specify 'id' as query param or header",
      { status: 400 }
    );
  }

  try {
    // Use ctx.runQuery with the correct function reference from the generated API
    const pkg = await ctx.runQuery(api.queries.packageTable.getPackageById.getPackageById, { packageId });
    
    if (!pkg) {
      return new Response(`Package with ID ${packageId} not found.`, { status: 404 });
    }

    return new Response(JSON.stringify(pkg), { status: 200 });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
});
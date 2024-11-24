import { query } from "../_generated/server";
import { v } from "convex/values";

export const getPackageById = query({
  args: { packageId: v.id("packageTable") }, // Validate that packageId is an ID from "packageTable"
  handler: async (ctx: any, args: any) => {
    const pkg = await ctx.db.get(args.packageId); // Fetch the package by ID
    pkg.metadata.ID = pkg._id;
    if (!pkg) {
      throw new Error(`Package with ID ${args.packageId} not found.`);
    }
    return pkg;
  },
});


export const getPackagesMetadata = query({
    args: {},
    handler: async (ctx: any, args: any) => {
         
        const pkgs = await ctx.db.query("packageTable").collect(); // Fetch all packages
        pkgs.forEach((pkg: any) => {
            pkg.metadata.ID = pkg._id;
        });
        //only return the metadata
        const packagesMetadata = pkgs.map((pkg: any) => pkg.metadata);
        return packagesMetadata;
    },
});
  
export const checkForPackage = query({
      args: {
      	packageName: v.string(),
	packageVer: v.string(),
      },
      returns: v.boolean(),
      handler: async (ctx, args) => {
	      const result = await ctx.db.query("packageTable")
	      .filter((q) =>
		      q.and(
			      // Fields are nested ;-;
			      q.eq(q.field("metadata").field("Name"), args.packageName),
			      q.eq(q.field("metadata").field("Version"), args.packageVer)
		      )
		     )
		     .first();
	      return result !== null;
      },
}); 

import { query } from "../_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

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
    args: {
      paginationOpts: paginationOptsValidator, 
      filters: v.optional(
        v.object(
          {
            Name: v.optional(v.string()), // Optional filter for Name
            Version: v.optional(v.string()), // Optional filter for Version
          }
        )
      )
    },
    handler: async (ctx: any, args: any) => {
        console.log('args:', args);
        let dbQuery = ctx.db.query("packageTable");

        // Apply name filter at the database level if provided
        if (args.filters?.Name) {
          dbQuery = dbQuery.filter((q: any) => q.eq(q.field("metadata.Name"), args.filters.Name));
        }
    
        // Fetch paginated results from the database
        const result = await dbQuery.paginate(args.paginationOpts);
        const pkgs = result.page;
        pkgs.forEach((pkg: any) => {
            pkg.metadata.ID = pkg._id;
        });
        //only return the metadata
        let packagesMetadata = pkgs.map((pkg: any) => pkg.metadata);
        console.log('Packages Metadata:', packagesMetadata);
        //filter packages based on their name and version
        if (args.filters) {
            const { Name, Version } = args.filters;
            if (Name) {
                packagesMetadata = packagesMetadata.filter((pkg: any) => pkg.Name === Name);
            }
            if (Version) {
              // Define regex patterns for different version types
              const exactVersion = Version.match(/^\d+\.\d+\.\d+$/);
              const boundedRange = Version.match(/^\d+\.\d+\.\d+-\d+\.\d+\.\d+$/);
              const carat = Version.match(/^\^\d+\.\d+\.\d+$/);
              const tilde = Version.match(/^~\d+\.\d+\.\d+$/);
      
              if (exactVersion) {
                  // Exact version: Match the exact version string
                  packagesMetadata = packagesMetadata.filter((pkg: any) => pkg.Version === Version);
              } else if (boundedRange) {
                  // Bounded range: Match versions within the specified range
                  const [minVersion, maxVersion] = Version.split('-');
                  packagesMetadata = packagesMetadata.filter(
                      (pkg: any) => pkg.Version >= minVersion && pkg.Version <= maxVersion
                  );
              } else if (carat) {
                  // Caret: Match versions compatible with the given major/minor version
                  const [major, minor, patch] = Version.slice(1).split('.').map(Number);
                  const minVersion = `${major}.${minor}.${patch}`;
                  const maxVersion = major === 0
                      ? `${major}.${minor + 1}.0` // If major is 0, caret considers the minor version fixed
                      : `${major + 1}.0.0`; // Else major is flexible
                  packagesMetadata = packagesMetadata.filter(
                      (pkg: any) => pkg.Version >= minVersion && pkg.Version < maxVersion
                  );
              } else if (tilde) {
                  // Tilde: Match versions with fixed minor and flexible patch
                  const [major, minor, patch] = Version.slice(1).split('.').map(Number);
                  const minVersion = `${major}.${minor}.${patch}`;
                  const maxVersion = `${major}.${minor + 1}.0`; // Minor is fixed, patches are flexible
                  packagesMetadata = packagesMetadata.filter(
                      (pkg: any) => pkg.Version >= minVersion && pkg.Version < maxVersion
                  );
              } else {
                  throw new Error('Invalid Version filter. Please provide a valid version filter.');
              }
          }      
        }
        return {
            packagesData: packagesMetadata,
            cursor: result. continueCursor,
        };
    },
});


export const getPackageByRegex = query({
  args: { regex: v.string() },
  handler: async (ctx: any, args: any) => {
    const result = await ctx.db.query("packageTable").collect(); // Fetch all packages
    //filter the packages based on the regex
    const regex = new RegExp(args.regex, 'i');
    const filteredPackages = result.filter((pkg: any) => regex.test(pkg.metadata.Name));
    console.log('Filtered Packages:', filteredPackages);
    //only return the metadata
    filteredPackages.forEach((pkg: any) => {
        pkg.metadata.ID = pkg._id;
    });
    return filteredPackages;
  },
});
  
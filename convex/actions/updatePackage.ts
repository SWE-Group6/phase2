"use node";

import { api } from "../_generated/api";
import { query, action, ActionCtx } from "../_generated/server";
import { v } from "convex/values";
import { uploadPackage } from "../mutations/uploadPackage";
import { debloatBase64Package, getRepoInfo, downloadPackage } from "../actions/packageUtils";

// TODO Should metrics be ran here?
// TODO call query for ID 

type UpdatePackageData = {
    Content?: string;
    JSProgram: string;
    Version: string;
    debloat?: boolean;
    Name: string;
    ID: string;
    URL?: string;
	Secret: boolean;
}

type UpdatePackageResult = {
    conflict?: boolean;
    metadata?: {
        message: string;
        code: number;
    };
}
export const updatePackage = action({
	args: {
		Data: v.union(
            v.object({
                Content: v.string(),
                JSProgram: v.string(),
				Version: v.string(),
                debloat: v.boolean(),
                Name: v.string(), // Ensure Name is included here
                ID: v.string(),   // Add ID if needed
				Secret: v.optional(v.boolean()),
            }),
            v.object({
                URL: v.string(),
				Content: v.string(),
                JSProgram: v.string(),
				Version: v.string(),
                Name: v.string(), // Include Name here as well
                ID: v.string(),   // Add ID if needed
				Secret: v.optional(v.boolean()),
            }),
        )
	},		
	handler: async (ctx: ActionCtx, args): Promise<UpdatePackageResult | any> => {
		if (!("Content" in args.Data) && !("URL" in args.Data)) {
			return {
				conflict: true,
				metadata: {
					message: "Provide either Content or Content and URL.",
					code: 400,
				},
			};
		}
		if (!("Content" in args.Data) && ("URL" in args.Data)) {
			return {
				conflict: true,
				metadata: {
					message: "Provide either Content or Content and URL.",
					code: 400,
				},
			};
		}
		else{
		// use the packageName to see if there is any package greater than the version the user is trying to upload
		let filters: any = {};
		const NameString = args.Data.Name;
		const VersionString = "^" + args.Data.Version;
		const limit = 100;
		const offset = null;
		if (NameString) {
			filters.Name = NameString;

		}
		console.log('Filters:', filters);
		const nameResult = await ctx.runQuery(api.queries.packageTable.getPackagesMetadata, {paginationOpts: {numItems: limit, cursor: offset }, filters});
		if(nameResult.packagesData.length === 0) {
			return {
				conflict: true,
				metadata: {
					message: "Package does not exist.",
					code: 404,
				},
			};
		}
		if (VersionString) {
			filters.Version = VersionString;
		}
		const nameAndVersionresult = await ctx.runQuery(api.queries.packageTable.getPackagesMetadata, {paginationOpts: {numItems: limit, cursor: offset }, filters}); 
		if(nameAndVersionresult.packagesData.length > 0) {
			return {
				conflict: true,
				metadata: {
					message: "There is a package with a greater version number.",
					code: 400,
				},
			};
		}
		
		//upload the package
		let result;
		const Content = args.Data.Content;
		// CHECK IF URL IS PROVIDED
		let URL: string | undefined; // Declare URL with a type
		if ("URL" in args.Data) { // Type guard to check if URL exists
			URL = args.Data.URL;
		}
		const JSProgram = args.Data.JSProgram;
		let debloat: boolean = false; // Initialize debloat with a default value
		if ("debloat" in args.Data) { // Type guard to check if debloat exists
			debloat = args.Data.debloat;
		}
		const Name = args.Data.Name;
        if (Content && URL) {
			console.log('We here in URL:', URL);
            result = await ctx.runAction(api.actions.qualifyPackage.qualifyPackage, {
                Data: {
                    URL,
                    JSProgram,
					Secret: args.Data.Secret || false,
                }
            });


            
        } else if(Content) {
			result = await ctx.runAction(api.actions.qualifyPackage.qualifyPackage, {
                Data: {
                    Content,
                    JSProgram,
                    debloat,
                    Name,
					Secret: args.Data.Secret || false,
                }
            });
        }

		return result;

		}

	},
});

"use node";

import { api } from "../_generated/api";
import { query, action, ActionCtx } from "../_generated/server";
import { v } from "convex/values";
import { checkForPackage, getPackageAndVersion } from "../queries/packageTable";
import { uploadPackage } from "../mutations/uploadPackage";
import { debloatBase64Package, getRepoInfo, downloadPackage } from "../actions/packageUtils";

// TODO Should metrics be ran here?
// TODO call query for ID 
export const updatePackage = action({
	args: {
		Name: v.string(),
		Version: v.string(),
		ID: v.string(),
		Content: v.optional(v.string()),
		URL: v.optional(v.string()),
		Debloat: v.optional(v.string()),
	},		
	handler: async (ctx: ActionCtx, args) => {
		if ('Content' in args && 'URL' in args) {
			return { 
				conflict: true,
				metadata: {
					message: "Cannot provide both content and URL",
					code: 400,
				},
			};
		} else if('Content' in args) {
			const { Name, Version, ID, Content, Debloat } = args;
			if (!Name || !Version || !ID || !Content) {
				return {
					conflict: true,
					metadata: {
						message: "one or more parameter is missing",
						code: 400,
					}
				};
			}		

			// 1. Run a query to see if version passed thru args is greater than version already in database.
			const currentPackage = await ctx.runQuery(api.queries.packageTable.getPackageAndVersion, {
				packageName: Name,
				packageVersion: Version,
			});

			if (!currentPackage) {
				return {
					conflict: true,
					metadata: {
						message: "Package not found in database",
						code: 404,
					}
				};
			}

			if (Version <= currentPackage.Version) {
				return {
					conflict: true,
					metadata: {
						message: "the provided version must be greater than the current version",
						code: 400,
					}
				};
			}

			// 2. If so, check debloat flag --> debloat package if true.
			let processedContent = Content;
			if (Debloat) {
				processedContent = debloatBase64Package(Content);
			}

			// 3. Run mutation to upload to database.
			const updatedPackageID = await ctx.runMutation(api.mutations.uploadPackage.uploadPackage, {
				packageName: Name, 
				packageVersion: Version,
				Content: processedContent,
			});

			// 4. Return 200: Version is updated.
			return {
				conflict: false, 
				metadata: {
					message: "Package updated successfully.",
					code: 200,
				}
			};
		} else if ('URL' in args) {
			const { Name, Version, ID, URL } = args;
			if (!Name || !Version || !ID || !URL) {
				return {
					conflict: true,
					metadata: {
						message: "one or more parameter is missing",
						code: 400,
					}
				};
			}

			// 1. Get version information from the provided URL.
			const currentPackage = await ctx.runQuery(api.queries.packageTable.getPackageAndVersion, {
                packageName: Name,
                packageVersion: Version,
            });

            if (!currentPackage) {
                return {
                    conflict: true,
                    metadata: { 
                        message: "Package not found in the database.",
                        code: 404,
                    },
                };
            }

            if (Version <= currentPackage.Version) {
                return {
                    conflict: true,
                    metadata: {
                        message: "The provided version must be greater than the current version.",
                        code: 400,
                    },
                };
            }

			// Safe to proceed with upload.
			const repoInfo = await getRepoInfo(URL);
			if (!repoInfo) {
				return {
					conflict: true,
					metadata: {
						message: "could not determine repo info from URL",
						code: 400,
					}
				};
			}

			const { owner, repo } = repoInfo;

			let base64Content;
			try {
				base64Content = await downloadPackage(owner, repo);
			} catch (error) {
				return {
					conflict: true,
					metadata: {
						message: "Failed to download package.",
						code: 500,
					}
				};
			}

			const updatedPackageID = await ctx.runMutation(api.mutations.uploadPackage.uploadPackage, {
				packageName: Name,
				packageVersion: Version,
				Content: base64Content,
				URL,
			});

			return {
				conflict: false,
				metadata: {
					message: "Version updated successfully.",
					code: 200,
				}
			};
		} else {
		        return {
            			conflict: true,
            			metadata: {
                			message: "An unknown error occurred.",
                			code: 500,
            			},
        		};	
		}	
	},
});

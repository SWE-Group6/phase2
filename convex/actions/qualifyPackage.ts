"use node";

import { api } from "../_generated/api";
import { query, action, ActionCtx } from "../_generated/server";
import { v } from "convex/values";
import { decodeBase64, unzipFile, findPackageJson, extractVersionFromPackage, debloatBase64Package, getRepoInfo, downloadPackage, downloadPackageBlob, base64ToBlob } from "../actions/packageUtils";
import { ratePackage } from "../handlers/packageIdHandlers";
import { createClerkClient } from "@clerk/backend";


const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
// This action will:
// 1. Validate that either content or URL has been passed.
// 2. Fetch package details from URL or raw content.
// 3. Check if package exists in database.
// 4. Calculate package scores.
// 5. Decide if data should be written.
export const qualifyPackage = action({
	// TODO change args to union 
	// TODO Call ratePackage for link
	args: {
		Data: v.union(
			v.object({
				Content: v.string(),
				JSProgram: v.string(),
				debloat: v.boolean(),
				Name: v.string(),
				Secret: v.boolean(),
				Version: v.string(),
			}),
			v.object({
				URL: v.string(),
				JSProgram: v.string(),
				Secret: v.boolean(),
			}),
		)
	},
	handler: async (ctx: ActionCtx, args) => {
		const Secret = args.Data.Secret || false;
		const identity = await ctx.auth.getUserIdentity();

		const organizationId = "org_2plow6YcQeyrrUQEzl72EzJQmDA"
		const orgList = await clerkClient.organizations.getOrganizationMembershipList({ organizationId })
		console.log('OrgList:', orgList);
		const userEmail = identity?.email;

		// Check if the user's email is in the orgList
		const isUserInOrg = orgList.data.some((membership) => membership.publicUserData?.identifier === userEmail);

		if (isUserInOrg) {
			console.log(`User with email ${userEmail} is in the organization.`);
		} else {
			console.log(`User with email ${userEmail} is NOT in the organization.`);
		}
		if (Secret == true && !isUserInOrg) {
			//check if the secret is set by the member of the org: org_2plow6YcQeyrrUQEzl72EzJQmDA using clerk
			return {
				conflict: true,
				metadata: {
					message: "User not allowed to set Secret.",
					code: 403,
				}
			};

		}
		if ('Content' in args.Data) { // proceed with 2-5.
			const { Content, JSProgram, debloat, Name } = args.Data;
			const Secret = args.Data.Secret;
			if (!Content) {
				return {
					conflict: true,
					metadata: {
						message: "Content must not be empty.",
						code: 400,
					}
				};
			}

			if (!Name) {
				return {
					conflict: true,
					metadata: {
						message: "Name must be provided when passing content.",
						code: 400,
					},
				};
			}


			// 1. Decode files.
			const decodedFiles = decodeBase64(Content);

			// 2. Unzip package.
			const zip = unzipFile(decodedFiles);

			// 2. Find package.json
			const packageJSON = findPackageJson(zip);

			// 3. Extract version info from the version field.
			const Version = args.Data.Version;
			const NameString = Name;
			const VersionString = Version;
			console.log('Name:', NameString);
			console.log('Version:', VersionString);
			//check if the Name and Version filter strings are empty and create the filters object accordingly
			let filters: any = {};
			filters.Name = NameString;
			filters.Version = VersionString;
			const limit = 100;
			const offset = null;
			const packageExists = await ctx.runQuery(api.queries.packageTable.getPackagesMetadata, { paginationOpts: { numItems: limit, cursor: offset }, filters });
			console.log("Package exists:", packageExists);
			//how to check if an array is empty

			if (packageExists.packagesData.length != 0) { // package exists, so propogate the error code and display the package.
				return {
					conflict: true,
					metadata: {
						Name: Name,
						Version: Version,
						message: "Package already exists.",
						code: 409,
					}
				};
			}

			// debloat if flagged.
			let processedContent = Content;
			let blob = base64ToBlob(Content);
			if (debloat === true) {
				processedContent = await debloatBase64Package(Content);
				blob = base64ToBlob(processedContent);

			}

			//convert the zip into blob and upload it to storage
			const storageId = await ctx.storage.store(blob);

			// Store data by calling mutation.
			let packageID: String = await ctx.runMutation(api.mutations.uploadPackage.uploadPackage, {
				packageName: Name,
				packageVersion: Version,
				Content: storageId,
				JSProgram,
				Secret
			}); // return the uniqueID to package with all the other details.

			const packageData: any = await ctx.runQuery(api.queries.packageTable.getPackageById, { packageId: packageID });
			console.log("Package data for Content Only:", packageData);
			return packageData;
		} else if ('URL' in args.Data) { // proceed with 2-5.
			const { URL, JSProgram } = args.Data;
			if (!URL) {
				return {
					conflict: true,
					metadata: {
						message: "The provided link is invalid.",
						code: 500,
					},
				};

			}

			if (URL.includes('github.com') || URL.includes('npmjs.com')) { // Reject if it's neither from GitHub or npm.
				// Gather metrics first. If it doesn't qualify, reject.
				const metrics: any = await ratePackage(URL);

				console.log("Netscore:", metrics.NetScore);
				if (metrics.NetScore < 0.5) {
					return {
						conflict: true,
						metadata: {
							message: "Package failed to meet minimum requirements on one or more metric.",
							code: 424,
						}
					};
				}

				let repoInfo = await getRepoInfo(URL); // Download from GitHub as base64 encoded content.
				if (!repoInfo) {
					return {
						conflict: true,
						metadata: {
							message: "Could not determine repo info from the URL",
							code: 400,
						}
					};
				}

				const { owner, repo } = repoInfo;
				let base64Content = "";
				try {

					base64Content = await downloadPackage(owner, repo);

					// Decode package to get name, version from package.json
					const decodedContent = decodeBase64(base64Content);
					const unzippedFile = unzipFile(decodedContent);
					const packageJSON = findPackageJson(unzippedFile);

					let packageName = "unknown";
					let packageVersion = "1.0.0";

					if (packageJSON) {
						const extractedVersion = extractVersionFromPackage(packageJSON);
						if (extractedVersion) {
							packageVersion = extractedVersion;
						}
						packageName = repo;
					}
					const NameString = packageName;
					const VersionString = packageVersion;
					console.log('Name:', NameString);
					console.log('Version:', VersionString);
					//check if the Name and Version filter strings are empty and create the filters object accordingly
					let filters: any = {};
					filters.Name = NameString;
					filters.Version = VersionString;
					const limit = 100;
					const offset = null;
					console.log("Package name:", packageName);
					const packageExists = await ctx.runQuery(api.queries.packageTable.getPackagesMetadata, { paginationOpts: { numItems: limit, cursor: offset }, filters });

					if (packageExists.packagesData.length != 0) { // package exists, so propogate the error code and display the package.
						return {
							conflict: true,
							metadata: {
								message: "Package already exists.",
								code: 409,
							}
						};
					}
					const zipBlob = await downloadPackageBlob(owner, repo);
					console.log("Blob ran");
					const storageId = await ctx.storage.store(zipBlob);


					let packageID: string = await ctx.runMutation(api.mutations.uploadPackage.uploadPackage, {
						packageName,
						packageVersion,
						Content: storageId,
						URL,
						JSProgram,
						Secret: args.Data.Secret || false
					});

					//call the packageId Query using runQuery to get the packageID
					const packageData: any = await ctx.runQuery(api.queries.packageTable.getPackageById, { packageId: packageID });
					console.log("Package data:", packageData);
					return packageData;
				} catch (error) {
					if (error instanceof Error) {
						console.error("Could not get package files:", error);
					} else {
						console.error("An unknown error occurred:", error);
					}
				}
			} else { // Something else was provided.
				return {
					conflict: true,
					metadata: {
						message: "An unknown error occurred.",
						code: 500,
					},
				};
			}

		}
	},
});

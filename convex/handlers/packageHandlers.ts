import { api } from "../_generated/api";
import { ActionCtx, httpAction } from "../_generated/server";
import { createClerkClient } from "@clerk/backend";

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
  const identity = await ctx.auth.getUserIdentity();
  const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
  console.log("Clerk Client: ", clerkClient);
  const organizationId = "org_2plow6YcQeyrrUQEzl72EzJQmDA";
  const orgList = await clerkClient.organizations.getOrganizationMembershipList({ organizationId });
  console.log('OrgList:', orgList);
  const userEmail = identity?.email;

  //Check if the user's email is in the orgList
  const isUserInOrg = orgList.data.some((membership: any) => membership.publicUserData?.identifier === userEmail);
  if (isUserInOrg) {
  console.log(`User with email ${userEmail} is in the organization.`);
  } else {
  console.log(`User with email ${userEmail} is NOT in the organization.`);
  //filter out the secret packages if the user is not in the org
  result.packagesData = result.packagesData.filter((pkg: any) => !pkg.Secret);
  }

  
  console.log("Headers:", headers);
  return new Response(JSON.stringify(result.packagesData), { status: 200, headers });
});
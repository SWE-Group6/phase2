import { api } from "../_generated/api";
import {httpAction } from "../_generated/server";
import { createClerkClient } from "@clerk/backend";

export const getPackageByRegexHTTPHandler = httpAction(async (ctx, request) => {
    try {
        const body = await request.json();
        console.log('Body:', body);
        const regex = body.RegEx;
        if (!regex) {
            return new Response(
                "RegEx not specified in the request body",
                { status: 400 }
            );
        }
        const result = await ctx.runQuery(api.queries.packageTable.getPackageByRegex, { regex });
        if (result.length === 0) {
            return new Response(`No packages found for the regex: ${regex}`, { status: 404 });
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
        let finalList = {};
        if (isUserInOrg) {
        console.log(`User with email ${userEmail} is in the organization.`);
        finalList = result; 
        } else {
        console.log(`User with email ${userEmail} is NOT in the organization.`);
        //filter out the secret packages if the user is not in the org
        finalList = result.filter((pkg: any) => !pkg.metadata.Secret);
        }
        return new Response(JSON.stringify(finalList), { status: 200 });
    } catch (error: any) {
        console.log('Error:', error);
        console.error('Error:', error.message);
        if (error.message.includes("Unauthorized")) {
            return new Response("Unauthorized", { status: 403 });
        }
        return new Response(error.message, { status: error.status || 404 });
    }
});
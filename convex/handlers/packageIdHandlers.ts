import { api } from "../_generated/api";
import { ActionCtx, httpAction } from "../_generated/server";
import axios from "axios";
import { Package } from "../package_rate/Models/Package"
import { createClerkClient } from "@clerk/backend";

let dependency = false;
// Function to generate a response based on the action
const generateResponse = async (action: string, pkg: any) => {
  if (action === 'rate') {
    const packageUrl = pkg["data"]["URL"];
    const metrics = await ratePackage(packageUrl);
    if (metrics.error) {
      return new Response(metrics.error, { status: 500 });
    }
    return new Response(JSON.stringify(metrics), { status: 200 });
  }
  if (action === 'cost') {
    const packageName = pkg["metadata"]["Name"];
    const cost = await findPackageCost(packageName, dependency);
    if ('error' in cost) {
      return new Response(cost.error, { status: 500 });
    }

    return new Response(JSON.stringify(cost), { status: 200 });
  } else {
    if (!pkg) {
      console.log('Package not found.');
      return new Response(`Package not found.`, { status: 404 });
    }
    return new Response(JSON.stringify(pkg), { status: 200 });
  }
}


export const getPackageByIdHTTPHandler = httpAction(async (ctx, request) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return new Response("Unauthorized", { status: 403 });
  }

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
  }


  const url = new URL(request.url);
  const pathParts = url.pathname.split("/"); // Split the path into parts
  const packageId = pathParts[2]; // Assuming "/package/{id}/rate"
  const action = pathParts[3]; // This should be "rate"
  console.log('packageId:', packageId);

  // Determines if dependencies will be included or not and sets global variable accordingly
  const dependencyConditionString = new URLSearchParams(url.search).get('dependency');
  dependency = dependencyConditionString === 'true';

  if (!packageId) {
    return new Response(
      "Package ID not specified in the URL path",
      { status: 400 }
    );
  }

  try {
    const pkg = await ctx.runQuery(api.queries.packageTable.getPackageById, { packageId }); // Fetch package using the query
    if (pkg.metadata.Secret == true && !isUserInOrg) {
      //check if the secret is set by the member of the org: org_2plow6YcQeyrrUQEzl72EzJQmDA using clerk
      return new Response("User not allowed to access this package.", { status: 403 });
    }

    return await generateResponse(action, pkg); // Generate response using the new function
  } catch (error: any) {
    return new Response(error.message, { status: error.status || 404 });
  }
});


//make a method that will handle the package rate. takes in the package url and returns the metrics
//does not have to be a httpAction
export const ratePackage = async (packageUrl: string) => {
  if (!packageUrl) {
    console.log('URL not found. Package is a manual upload.');
    return { error: 'URL not found. Package is a manual upload.' };
  }
  const metricsPackage = new Package(packageUrl); // Assuming version is optional
  try {
    const metrics = await metricsPackage.getMetrics();
    return metrics;
  }
  catch (error) {
    console.error('The package rating system choked on at least one of the metrics.:', error);
    return { error: 'Failed to fetch metrics' };
  }
}

export const findPackageCost = async (packageName: string, dependencyVal: boolean) => {
  try {
    const packageData = await axios.get(`https://bundlephobia.com/api/size?package=${packageName}`);
    const mainPackageSize = packageData.data;

    const filteredPackage = {
      packageName: mainPackageSize.name,
      packageSize: `${(mainPackageSize.size / 1024).toFixed(2)} KB`,
      dependencies: dependencyVal ? mainPackageSize.dependencySizes
        .filter((dep: { name: string; approximateSize: number; }) => dep.name !== mainPackageSize.name)
        .map((dep: { name: string; approximateSize: number; }) => ({
          name: dep.name,
          size: `${(dep.approximateSize / 1024).toFixed(2)} KB`
        })) : []
    };

    return filteredPackage;

  } catch (error) {
    console.error('Error fetching package or dependencies size:', error);
    return { error: 'Failed to fetch package data' };
  }
}
import { api } from "../_generated/api";
import { action, ActionCtx, httpAction } from "../_generated/server";
import { qualifyPackage } from "../actions/qualifyPackage";
import { createClerkClient } from '@clerk/backend'

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

/*
Explanation on Packages can be marked as secret:
only members of the private-packages org setup in clerk can send the Secret parameter as true
If the user is not in the org, but they still tagged the secret parameter to be true, then we throw an error
else, we can set the secret parameter to be false by default.
*/


export const uploadPackageHandler = httpAction(async (ctx, request) => {
	try { 
		
        const body = await request.json();
		
		const { Content, URL, JSProgram, debloat, Name} = body;
        const Secret = body.Secret || false;
        console.log('Content:', Content);
        console.log('URL:', URL);
        console.log('JSProgram:', JSProgram);
        console.log('debloat:', debloat);
        const identity = await ctx.auth.getUserIdentity();
        console.log("Secret: " , Secret);
        console.log('Identity:', identity);
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
        if (Secret && !isUserInOrg) {
            //check if the secret is set by the member of the org: org_2plow6YcQeyrrUQEzl72EzJQmDA using clerk
            return new Response(
                JSON.stringify({ error: "Unauthorized access. User Cannot set the Secret variable " }),
                { status: 403 } // Forbidden
            );
            
        }

		if ((Content && URL) || (!Content && !URL)) {
			return new Response(
				JSON.stringify({ error: "Provide either content or URL, but not both" }),
				{ status: 400 } // Bad request
			);
		} 

        //if Secret is undefined, then set it to false


        let result;
        if (Content) {
            result = await ctx.runAction(api.actions.qualifyPackage.qualifyPackage, {
                Data: {
                    Content,
                    JSProgram,
                    debloat,
                    Name,
                    Secret
                }
            });
        } else if (URL) {
            result = await ctx.runAction(api.actions.qualifyPackage.qualifyPackage, {
                Data: {
                    URL,
                    JSProgram,
                    Secret
                }
            });
        }

        if (!result) {
            return new Response(
                JSON.stringify({ error: "An internal server error caused the package to not upload:", Error }),
                { status: 500 },
            );
        }

		// Check the result for conflict or success.
        if (result.conflict) {
            return new Response(
                JSON.stringify({
                    error: result.metadata.message
                	}),
                	{ status: result.metadata.code || 400 } // Use code from the response or default to 400.
                );
        }
        console.log('Result:', result);
        // If there's no conflict, return the success response.
        return new Response(
            JSON.stringify(result),
            { status:  201 } // Created or appropriate success code.
        );
	} catch (error) {
        console.error("Error in uploadPackageHandler:", error); // Log the error for debugging

        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        return new Response(
            JSON.stringify({ error: "An unexpected error occurred.", details: errorMessage }),
            { status: 500 }
        );
	}	
});

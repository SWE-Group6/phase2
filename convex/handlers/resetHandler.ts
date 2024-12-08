import { httpAction } from "../_generated/server";
import { api } from "../_generated/api";
import { createClerkClient } from "@clerk/backend";

export const resetHandler = httpAction(async (ctx, request) => {

    const identity = await ctx.auth.getUserIdentity();
    console.log('Identity:', identity);
    const userId = identity?.subject;
    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    const organizationId = "org_2plow6YcQeyrrUQEzl72EzJQmDA";
    const orgList = await clerkClient.organizations.getOrganizationMembershipList({ organizationId });
    console.log('OrgList:', orgList);
    //check if the user has the role:admin in the org
    const isAdmin = orgList.data.some((membership: any) => 
        (membership.publicUserData?.identifier === identity?.email || membership.publicUserData?.userId === userId) && 
        membership.role === 'org:admin'
    );
    console.log('isAdmin:', isAdmin);
    if (!isAdmin) {
        return new Response("Unauthorized", { status: 403 });
    }
    try {
        await ctx.runMutation(api.mutations.packageTable.clearTable);
        // get a list of all the users from clerk and delete them one by one
        

        const userList = await clerkClient.users.getUserList(); // Fetch the list of users
        const users = userList.data; // Access the data property to get the user array

        console.log('User List:', users);

        for (let i = 0; i < users.length; i++) {
            const user = users[i]; // Access the user object at the current index
            const userId = user.id; // Correctly fetch the user ID
            const username = user.username; // Correctly fetch the username

            console.log(`User: ${username}`);

            // Check conditions and skip or delete the user
            if (userId && typeof userId === 'string' && username !== 'ece30861defaultadminuser') {
                await clerkClient.users.deleteUser(userId); // Delete the user
                console.log(`Deleted user with username: ${username}`);
            } else {
                console.log(`Skipping user with username: ${username}`);
            }
        }

        return new Response(JSON.stringify({}));

            } catch (error: any) {
                return new Response(error.message, { status: error.status || 404 })
    }
});

import { httpAction } from "../_generated/server";
import { createClerkClient } from '@clerk/backend'



export const authenticateHandler = httpAction(async (ctx, request) => {
  try {
        // Parse the request body
        const { User, Secret } = await request.json();
        const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY, publishableKey: process.env.VITE_CLERK_PUBLISHABLE_KEY });
        const users = await clerkClient.users.getUserList({query: User["name"]});
        const userId = users["data"][0]["id"];
        const passwordVerification = await clerkClient.users.verifyPassword({userId, password: Secret["password"]});
        console.log(passwordVerification);
        if (!passwordVerification["verified"]) {
            throw new Error("invalid credentials");
        }
        //create a new session and then create a new jwt token for the session
        const response = await fetch('https://api.clerk.com/v1/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId }),
        });

        const session = await response.json();
        const sessionId = session["id"];
        // call the https://api.clerk.com/v1/sessions/{session_id}/tokens/convex endpoint to create a new token
        const tokenResponse = await fetch(`https://api.clerk.com/v1/sessions/${sessionId}/tokens/convex`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        const tokenJSON = await tokenResponse.json();
        const token = tokenJSON["jwt"];
        return new Response(JSON.stringify("Bearer "+ token), { status: 200 });
    
  } catch (error: any) {
    if (error.message.includes("Unprocessable Entity")) {
      // Return 401 if the user or password is invalid
      return new Response("The user or password is invalid.", { status: 401 });
    }
    
    // If any required fields are missing, return 400
    if (error.message.includes("missing fields")) {
      return new Response("There is missing field(s) in the AuthenticationRequest or it is formed improperly.", { status: 400 });
    }

    // Return 501 if the system does not support authentication
    return new Response(error.message , { status: 501 });
  }
});
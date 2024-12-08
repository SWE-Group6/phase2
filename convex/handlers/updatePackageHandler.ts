import { api } from "../_generated/api";
import { action, ActionCtx, httpAction } from "../_generated/server";
import { updatePackage } from "../actions/updatePackage";

export const updatePackageHandler = httpAction(async (ctx, request) => {
	try {
		const body = await request.json();
		const Name = body.metadata.Name;
        const Version = body.metadata.Version;
        const ID = body.metadata.ID;
        const Content = body.data.Content;
        const URL = body.data.URL;
        const debloat = body.data.debloat;
        const JSProgram = body.data.JSProgram;


        if (!Name || !Version || !ID) {
            return new Response(
                JSON.stringify({ error: "One or more required parameters are missing." }),
                { status: 400 },
            );
        }
        let result;
        if((Content && URL)) {
            result = await ctx.runAction(api.actions.updatePackage.updatePackage, {                        
                Data: {
                    Content,
                    URL,
                    JSProgram,
                    Name,
                    ID,
                    Version,
                }
            });
        }
        else {
            result = await ctx.runAction(api.actions.updatePackage.updatePackage, {
                Data: {
                    Content,
                    JSProgram,
                    debloat,
                    Name,
                    ID,
                    Version,
                }
            });
        }
        // Check the result for conflict or success.  
        if (result.conflict) {
            return new Response(
                JSON.stringify({
                    error: result.metadata.message,
                    metadata: result.metadata,
                }),
                { status: result.metadata.code || 400 } // Use code from the response or default to 400.
            );
         }

         // If there's no conflict, return the success response. 
         return new Response(
             JSON.stringify(result),
             { status: result.metadata.code || 200 } // Created or appropriate success code.
         );
	} catch (error) {
        // Log the error for debugging purposes
        console.error("An unexpected error occurred:", error);
        // Always return a response in case of errors
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
});

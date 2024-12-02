import { api } from "../_generated/api";
import { action, ActionCtx, httpAction } from "../_generated/server";
import { qualifyPackage } from "../actions/qualifyPackage";

export const uploadPackageHandler = httpAction(async (ctx, request) => {
	try { 
		const body = await request.json();
		
		const { Content, URL, Debloat, Name } = body;
		
		if ((Content && URL) || (!Content && !URL)) {
			return new Response(
				JSON.stringify({ error: "Provide either content or URL, but not both" }),
				{ status: 400 } // Bad request
			);
		} 

		const result = await ctx.runAction(api.actions.qualifyPackage.qualifyPackage, {
			Content, 
			Name, 
			URL,
			Debloat,
		});

        if (!result) {
            return new Response(
                JSON.stringify({ error: "Couldn't upload package successfully:", Error }),
                { status: 500 },
            );
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
            		JSON.stringify({
                		message: "Package uploaded successfully.",
                		metadata: result.metadata,
            		}),
            		{ status: result.metadata.code || 201 } // Created or appropriate success code.
        	);
	} catch (error) {
        console.error("An unexpected error occurred:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
	}	
});

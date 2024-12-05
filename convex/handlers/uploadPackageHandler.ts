import { api } from "../_generated/api";
import { action, ActionCtx, httpAction } from "../_generated/server";
import { qualifyPackage } from "../actions/qualifyPackage";

export const uploadPackageHandler = httpAction(async (ctx, request) => {
	try { 
		const body = await request.json();
		
		const { Content, URL, JSProgram, Debloat, Name} = body;
		
		if ((Content && URL) || (!Content && !URL)) {
			return new Response(
				JSON.stringify({ error: "Provide either content or URL, but not both" }),
				{ status: 400 } // Bad request
			);
		} 

        let result;
        if (Content) {
            result = await ctx.runAction(api.actions.qualifyPackage.qualifyPackage, {
                Data: {
                    Content,
                    JSProgram,
                    Debloat,
                    Name,
                }
            });
        } else if (URL) {
            result = await ctx.runAction(api.actions.qualifyPackage.qualifyPackage, {
                Data: {
                    URL,
                    JSProgram,
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
        console.error("Error in uploadPackageHandler:", error); // Log the error for debugging

        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        return new Response(
            JSON.stringify({ error: "An unexpected error occurred.", details: errorMessage }),
            { status: 500 }
        );
	}	
});

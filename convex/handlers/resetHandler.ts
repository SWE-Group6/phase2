import { httpAction } from "../_generated/server";
import { api } from "../_generated/api";
import { Package } from "../package_rate/Models/Package"

export const resetHandler = httpAction(async (ctx, request) => {
    try {
        await ctx.runMutation(api.mutations.packageTable.clearTable);

        return new Response(JSON.stringify({}));

            } catch (error: any) {
                return new Response(error.message, { status: error.status || 404 })
    }
});

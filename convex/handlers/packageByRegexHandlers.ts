import { api } from "../_generated/api";
import {httpAction } from "../_generated/server";

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
        return new Response(JSON.stringify(result), { status: 200 });
    } catch (error: any) {
        console.error('Error:', error);
        return new Response("There is missing field(s) in the PackageRegEx or it is formed improperly, or is invalid", { status: 400 });
    }
});
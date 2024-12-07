"use node";

import { action, ActionCtx } from '../_generated/server';
import { v } from "convex/values";
import { api } from "../_generated/api";


export const deletePackage = action({
    args: { name: v.string(), version: v.string() },
    handler: async (ctx: ActionCtx, args) => {
        await ctx.runMutation(api.mutations.deletePackage.deletePackage, { name: args.name, version: args.version });
    }
})
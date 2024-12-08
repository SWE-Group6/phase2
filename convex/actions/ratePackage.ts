"use node";

import { action, ActionCtx } from '../_generated/server';
import { v } from "convex/values";
import { api } from "../_generated/api";
import { Package } from '../package_rate/Models/Package';


export const ratePackage = action({
    args: { name: v.string(), version: v.string() },
    handler: async (ctx: any, { name, version }) => {

        const specificPackage = await ctx.db
            .query("packageTable")
            .filter((q: any) => (q.eq(q.field1("Name"), name), q.eq(q.field2("Version"), version)))
            .unique();

        const url = specificPackage?.URL;
        const metrics = new Package(url);


    },
});
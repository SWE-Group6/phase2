"use node";

import { action } from '../_generated/server';
import { v } from "convex/values";
import { api } from "../_generated/api";
import { Package } from '../package_rate/Models/Package';


export const ratePackage = action({
    args: { name: v.string(), version: v.string() },
    handler: async (ctx: any, { name, version }) => {
        const db = ctx.db;

        // Find the document using nested field paths
        const doc = await db.query("packageTable")
            .filter(
                (q: any) =>
                    q.eq(q.field("metadata.Name"), name) &&
                    q.eq(q.field("metadata.Version"), version)
            )
            .unique();

        console.log(doc.URL);
        const packageMetrics = new Package(doc.URL);
        try {
            const metrics = await packageMetrics.getMetrics();
            return metrics;
        }
        catch (error) {
            console.error('Error', error);
            return { error: "Failed" };
        }
    },
});
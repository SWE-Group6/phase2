import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const deletePackage = mutation({
    args: {
        name: v.string(),
        version: v.string(),
    },
    handler: async (ctx, { name, version }) => {
        const db = ctx.db;

        // Find the document using nested field paths
        const docs = await db.query("packageTable")
            .filter(
                q =>
                    q.eq(q.field("metadata.Name"), name) &&
                    q.eq(q.field("metadata.Version"), version)
            )
            .collect();

        if (docs.length === 0) {
            throw new Error("No documents found");
        }

        for (const doc of docs) {
            await db.delete(doc._id);
        }

        return `${docs.length} package(s) deleted successfully.`;
    },
});
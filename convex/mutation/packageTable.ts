import { mutation } from "../_generated/server";

export const clearTable = mutation({
  args: {}, 
  handler: async (ctx: any) => {
    
    const rows = await ctx.db.query("packageTable").collect();

    for (const row of rows) {
      await ctx.db.delete(row._id);
    }
    return { success: true, message: "Table cleared successfully!" };
  },
});

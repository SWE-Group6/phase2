import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
// Import utility functions.

// Upload a new package by either providing content or a link.
export const uploadPackage = mutation({
	args: { zippedPackage: v.optional(v.string()), // Base64 encoded zip file content.
		linkedPackage: v.optional(v.string()), // URL for the package.
		JSProgram: v.string(), // I guess the helper code that will 

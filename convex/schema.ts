// NOTE: You can remove this file. Declaring the shape
// of the database is entirely optional in Convex.
// See https://docs.convex.dev/database/schemas.

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { Package } from "./package_rate/Models/Package";

export default defineSchema(
  {
    packageTable: defineTable({
      metadata: v.object({
        Name: v.string(), // Package name
        Version: v.string(), // Package version
      }),
      data: v.union(
        v.object({
          Content: v.string(), // Base64 encoded zip file content
          JSProgram: v.string(), // Optional JavaScript program (for sensitive modules)
        }),
        v.object({
          Content: v.string(), // Base64 encoded zip file content
          URL: v.string(), // URL for public ingestion
          JSProgram: v.string(), // Optional JavaScript program (for sensitive modules)
        })
      ),
    }),

    packageScores: defineTable({
    	Name: v.string(),
    	Version: v.string(),
    	BusFactorScore: v.float64(),
    	CorrectnessScore: v.float64(),
    	DependancyScore: v.float64(),
    	LicenseScore: v.float64(),
    	NetScore: v.float64(),
    	PulledCodeScore: v.float64(),
    	RampUpScore: v.float64(),
    	ResponsiveMaintainerScore: v.float64(),
    }),
  },
  
  // If you ever get an error about schema mismatch
  // between your data and your schema, and you cannot
  // change the schema to match the current data in your database,
  // you can:
  //  1. Use the dashboard to delete tables or individual documents
  //     that are causing the error.
  //  2. Change this option to `false` and make changes to the data
  //     freely, ignoring the schema. Don't forget to change back to `true`!
  { schemaValidation: true }
);

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    human: v.boolean(),
    message: v.string(),
  }),
  videos: defineTable({
    title: v.string(),
    description: v.string(),
    filePath: v.string(),
    transcript: v.string(),
  }),
});

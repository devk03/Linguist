import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    human: v.boolean(),
    message: v.string(),
  }),
  videos: defineTable({
    title: v.string(),
    chunkIds: v.array(v.string()),
  }),
  chunks: defineTable({
    videoId: v.id("_storage"),
    chunkId: v.string(),
    text: v.string(),
    start: v.number(),
    end: v.number(),
  }),
});

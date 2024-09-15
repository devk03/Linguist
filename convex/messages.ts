import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const postVideoData = mutation({
  args: { videoId: v.id("_storage"), title: v.string(), chunkIds: v.array(v.string()) },
  handler: async (ctx, args) => {
    await ctx.db.insert("videos", {
      title: args.title,
      chunkIds: args.chunkIds,
    });
  },
});

export const postChunkData = mutation({
  args: { videoId: v.id("_storage"), chunkId: v.string(), text: v.string(), start: v.number(), end: v.number() },
  handler: async (ctx, args) => {
    await ctx.db.insert("chunks", {
      videoId: args.videoId,
      chunkId: args.chunkId,
      text: args.text,
      start: args.start,
      end: args.end,
    });
  },
});


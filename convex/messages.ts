import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { query } from "./_generated/server";
import { internal } from "./_generated/api";

export const list = query({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    return (
      await ctx.db
        .query("messages")
        .withIndex("bySessionId", (q) => q.eq("sessionId", args.sessionId))
        .collect()
    ).map(({ message: { data, type }, ...fields }) => ({
      ...fields,
      isViewer: type === "human",
      text: data.content,
    }));
  },
});

export const send = mutation({
  args: {
    message: v.string(),
    sessionId: v.string(),
  },
  handler: async (ctx, { message, sessionId }) => {
    await ctx.scheduler.runAfter(0, internal.serve.answer, {
      sessionId,
      message,
    });
  },
});

export const clear = mutation({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("bySessionId", (q) => q.eq("sessionId", args.sessionId))
      .collect();
    await Promise.all(messages.map((message) => ctx.db.delete(message._id)));
  },
});

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


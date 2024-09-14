import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const post = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    filePath: v.string(),
    transcript: v.string(),
  },
  handler: async (ctx, args) => {
    const newTaskId = await ctx.db.insert("videos", {
      title: args.title,
      description: args.description,
      filePath: args.filePath,
      transcript: args.transcript,
    });
    return newTaskId;
  },
});

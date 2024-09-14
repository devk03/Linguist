import { mutation } from "../_generated/server";
import { query } from "../_generated/server";
import { v } from "convex/values";

export const post = mutation({
    args: {
        title: v.string(),
        chunkIds: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const newTaskId = await ctx.db.insert("videos", {
            title: args.title,
            chunkIds: args.chunkIds,
        });
        return newTaskId;
    },
});

export const findByTitle = query({
    args: {
        title: v.string(),
    },
    handler: async (ctx, args) => {
        const video = await ctx.db.query("videos")
            .filter((q) => q.eq(q.field("title"), args.title))
            .collect();
        if (video.length === 0) {
            return null;
        }
        return video;
    },
});


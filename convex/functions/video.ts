import { action, query, QueryCtx } from "../_generated/server";
import { v } from "convex/values";
import { downloadVideo } from "../helpers/fetchvideo";

//function to get the video url from the file storage given an id
export const backend = query({
    args: { id: v.id("_storage") },
    async handler(ctx, args) {
    }
});

//function to fetch the video from the url and save it to the file storage use regular fetch



import { CohereClient } from "cohere-ai";
import { action } from "../_generated/server";
import { v } from "convex/values";
const COHERE_API_KEY = process.env.COHERE_API_KEY!;
const client = new CohereClient({ token: COHERE_API_KEY });

export const send = action({
    args: {
        text: v.string(),
        isViewer: v.boolean(),
    },
    handler: async (ctx, args) => {
        // TODO: add query to chat history
        const result = await client.chat(
            {
                message: args.text,
                model: "command-r-plus",
                preamble: "You are an AI-assistant chatbot. You are trained to assist users by providing thorough and helpful responses to their queries. I need all answers to be in the same language the message comes in.",
                chatHistory: []
            }
        )
        const response = {
            _id: Date.now().toString(),
            text: result.text,
            isViewer: false,
        }
        return response
    },
});


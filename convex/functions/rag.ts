import { ChromaClient } from "chromadb";
import { action } from "../_generated/server";
import { v } from "convex/values";

// Improved type annotations for better type safety and clarity
interface EmbeddingArgs {
    document: string[];
    ids: string[];
    collectionName: string;
}

const createEmbedding = async ({ document, ids, collectionName }: EmbeddingArgs) => {
    const client = new ChromaClient();
    const collection = await client.createCollection({ name: collectionName });
    // Error handling for potential issues during the add operation
    try {
        await collection.add({
            documents: document,
            ids: ids,
        });
    } catch (error) {
        console.error("Failed to add documents to collection:", error);
        throw new Error("Error adding documents to the collection");
    }
}

export const triggerEmbeddings = action({
    args: {
        document: v.array(v.string()),
        ids: v.array(v.string()),
        collectionName: v.string(),
    },
    handler: async (ctx: any, args: EmbeddingArgs) => {
        // Error handling for the embedding creation process
        try {
            await createEmbedding(args);
        } catch (error) {
            console.error("Error triggering embeddings:", error);
            throw error; // Re-throw to handle upstream
        }
    }
})
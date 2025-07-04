import { createTool } from "@inngest/agent-kit";
import { z } from "zod";
import prisma from "@/lib/prisma";

// Define a Memory model interface
interface Memory {
  id: string;
  content: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  keywords: string[];
}

// In-memory cache for faster retrieval
let memoryCache: Memory[] = [];

// Implementation of memory system using Prisma
export const mem0 = {
  async add(statements: { role: string; content: string }[]) {
    try {
      // Create a transaction to add all memories at once
      const createdMemories = await prisma.$transaction(
        statements.map(statement => {
          // Extract keywords for better searching
          const keywords = extractKeywords(statement.content);
          
          // Create a new memory entry in the database
          // Note: This assumes you have a Memory model in your Prisma schema
          // If not, you'll need to adapt this to use an existing model or create a new one
          return prisma.message.create({
            data: {
              content: statement.content,
              role: statement.role === "assistant" ? "ASSISTANT" : "USER",
              type: "RESULT",
              // Store as a special project type for memories
              projectId: "memory-store", // You might want to create a special project for memories
              // Store keywords as metadata in the fragment
              fragment: {
                create: {
                  title: `Memory: ${statement.content.slice(0, 30)}...`,
                  sandboxUrl: "",
                  files: { keywords },
                }
              }
            },
          });
        })
      );
      
      // Update the cache
      await this.refreshCache();
      
      return createdMemories;
    } catch (error) {
      console.error("Failed to add memories:", error);
      return [];
    }
  },
  
  async search(queries: string[]) {
    try {
      // Ensure cache is populated
      if (memoryCache.length === 0) {
        await this.refreshCache();
      }
      
      // If no queries, return empty array
      if (!queries.length) return [];
      
      // Prepare search terms
      const searchTerms = queries.flatMap(query => 
        query.toLowerCase().split(/\s+/).filter(term => term.length > 3)
      );
      
      if (searchTerms.length === 0) return [];
      
      // Score each memory based on relevance to search terms
      const scoredMemories = memoryCache.map(memory => {
        const content = memory.content.toLowerCase();
        let score = 0;
        
        // Calculate relevance score
        for (const term of searchTerms) {
          if (content.includes(term)) {
            // More points for exact matches
            score += 10;
          }
          
          // Check keywords for matches
          if (memory.keywords && memory.keywords.some(k => k.includes(term))) {
            score += 5;
          }
        }
        
        return { memory, score };
      });
      
      // Sort by score (highest first) and take top 10 results
      const results = scoredMemories
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map(item => item.memory.content);
      
      return results;
    } catch (error) {
      console.error("Failed to search memories:", error);
      return [];
    }
  },
  
  async update(updates: { id: string; statement: string }[]) {
    try {
      // Update memories in database
      const updatedMemories = await prisma.$transaction(
        updates.map(update => {
          const keywords = extractKeywords(update.statement);
          
          return prisma.message.update({
            where: { id: update.id },
            data: {
              content: update.statement,
              fragment: {
                update: {
                  files: { keywords },
                }
              }
            },
          });
        })
      );
      
      // Refresh cache after updates
      await this.refreshCache();
      
      return updatedMemories;
    } catch (error) {
      console.error("Failed to update memories:", error);
      return [];
    }
  },
  
  async delete(deletions: { id: string }[]) {
    try {
      // Delete memories from database
      const deletedMemories = await prisma.$transaction(
        deletions.map(deletion => 
          prisma.message.delete({
            where: { id: deletion.id },
          })
        )
      );
      
      // Refresh cache after deletions
      await this.refreshCache();
      
      return deletedMemories;
    } catch (error) {
      console.error("Failed to delete memories:", error);
      return [];
    }
  },
  
  // Helper method to refresh the memory cache
  async refreshCache() {
    try {
      // Fetch all memories from the database
      const memories = await prisma.message.findMany({
        where: {
          projectId: "memory-store",
        },
        include: {
          fragment: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      
      // Transform to Memory interface
      memoryCache = memories.map(message => ({
        id: message.id,
        content: message.content,
        role: message.role === "ASSISTANT" ? "assistant" : "user",
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        keywords: message.fragment?.files ? 
          (message.fragment.files as any).keywords || [] : 
          extractKeywords(message.content),
      }));
      
      return memoryCache;
    } catch (error) {
      console.error("Failed to refresh memory cache:", error);
      return [];
    }
  },
};

// Helper function to extract keywords from text
function extractKeywords(text: string): string[] {
  // Simple keyword extraction - remove common words and keep significant terms
  const stopWords = new Set([
    "a", "an", "the", "and", "or", "but", "is", "are", "was", "were", 
    "be", "been", "being", "have", "has", "had", "do", "does", "did",
    "to", "from", "in", "out", "on", "off", "over", "under", "again",
    "further", "then", "once", "here", "there", "when", "where", "why",
    "how", "all", "any", "both", "each", "few", "more", "most", "other",
    "some", "such", "no", "nor", "not", "only", "own", "same", "so",
    "than", "too", "very", "can", "will", "just", "should", "now"
  ]);
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(/\s+/)
    .filter(word => 
      word.length > 3 && !stopWords.has(word)
    )
    .slice(0, 20); // Keep top 20 keywords
}

export const createMemoriesTool = createTool({
  name: "create_memories",
  description: "Save new memory statements.",
  parameters: z.object({ statements: z.array(z.string()) }),
  handler: async ({ statements }, { step }) => {
    if (step) {
      // Following the documentation format for sendEvent
      await step.sendEvent("create-memories-event", {
        name: "app/memories.create",
        data: { 
          statements,
          role: "user" // Default role
        },
      });
    }
    return `I have scheduled the creation of ${statements.length} new memories.`;
  },
});

export const recallMemoriesTool = createTool({
  name: "recall_memories",
  description: "Lookup memories relevant to your queries.",
  parameters: z.object({ queries: z.array(z.string()) }),
  handler: async ({ queries }) => {
    const results = await mem0.search(queries);
    return results;
  },
});

export const manageMemoriesTool = createTool({
  name: "manage_memories",
  description: "Create/update/delete memories in one go.",
  parameters: z.object({
    creations: z.array(z.string()).optional(),
    updates: z.array(z.object({ id: z.string(), statement: z.string() })).optional(),
    deletions: z.array(z.object({ id: z.string() })).optional(),
  }),
  handler: async ({ creations, updates, deletions }, { step }) => {
    if (step) {
      if (creations?.length) {
        await step.sendEvent("manage-memories-create", { 
          name: "app/memories.create", 
          data: { 
            statements: creations,
            role: "user" // Default role
          } 
        });
      }
      if (updates?.length) {
        await step.sendEvent("manage-memories-update", { 
          name: "app/memories.update", 
          data: { updates } 
        });
      }
      if (deletions?.length) {
        await step.sendEvent("manage-memories-delete", { 
          name: "app/memories.delete", 
          data: { deletions } 
        });
      }
    }
    
    // Return a user-friendly message as per documentation
    let operations = [];
    if (creations?.length) operations.push(`created ${creations.length} memories`);
    if (updates?.length) operations.push(`updated ${updates.length} memories`);
    if (deletions?.length) operations.push(`deleted ${deletions.length} memories`);
    
    return `I have scheduled the following memory operations: ${operations.join(", ")}.`;
  },
});

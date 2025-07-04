import { inngest } from "./client";
import { mem0 } from "./memory";

// Function to add new memories
export const addMemoriesFn = inngest.createFunction(
  { id: "add-memories" },
  { event: "app/memories.create" },
  async ({ event }) => {
    const { statements } = event.data;
    const role = event.data.role || "user"; // Default to user if not specified
    
    await mem0.add(statements.map((s: string) => ({ 
      role, 
      content: s 
    })));
    
    return { 
      status: `Added ${statements.length} memories.`,
      count: statements.length
    };
  }
);

// Function to update existing memories
export const updateMemoriesFn = inngest.createFunction(
  { id: "update-memories" },
  { event: "app/memories.update" },
  async ({ event }) => {
    const { updates } = event.data;
    
    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return { status: "No updates provided." };
    }
    
    await mem0.update(updates);
    
    return { 
      status: `Updated ${updates.length} memories.`,
      count: updates.length
    };
  }
);

// Function to delete memories
export const deleteMemoriesFn = inngest.createFunction(
  { id: "delete-memories" },
  { event: "app/memories.delete" },
  async ({ event }) => {
    const { deletions } = event.data;
    
    if (!deletions || !Array.isArray(deletions) || deletions.length === 0) {
      return { status: "No deletions provided." };
    }
    
    await mem0.delete(deletions);
    
    return { 
      status: `Deleted ${deletions.length} memories.`,
      count: deletions.length
    };
  }
);

// Function to search memories directly
export const searchMemoriesFn = inngest.createFunction(
  { id: "search-memories" },
  { event: "app/memories.search" },
  async ({ event }) => {
    const { queries } = event.data;
    
    if (!queries || !Array.isArray(queries) || queries.length === 0) {
      return { results: [], status: "No search queries provided." };
    }
    
    const results = await mem0.search(queries);
    
    return { 
      results,
      status: `Found ${results.length} relevant memories.`,
      count: results.length
    };
  }
);

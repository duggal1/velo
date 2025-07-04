// Export all Inngest functions
import { inngest } from "./client";
import { codeAgentFunction, ensureMemoryStoreFunction } from "./functions";
import { addMemoriesFn, updateMemoriesFn, deleteMemoriesFn, searchMemoriesFn } from "./memories-functions";
import { createMemoriesTool, recallMemoriesTool, manageMemoriesTool } from "./memory";
import { historyAdapter } from "./history";

// Export the Inngest client
export { inngest };

// Export all functions
export const functions = [
  // Code agent functions
  codeAgentFunction,
  ensureMemoryStoreFunction,
  
  // Memory functions
  addMemoriesFn,
  updateMemoriesFn,
  deleteMemoriesFn,
  searchMemoriesFn,
];

// Export memory tools
export const memoryTools = {
  createMemoriesTool,
  recallMemoriesTool,
  manageMemoriesTool,
};

// Export history adapter
export { historyAdapter };
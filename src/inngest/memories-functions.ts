import { inngest } from "./client";
import { mem0 } from "./memory";

export const addMemoriesFn = inngest.createFunction(
  { id: "add-memories" },
  { event: "app/memories.create" },
  async ({ event }) => {
    const { statements } = event.data;
    await mem0.add(statements.map((s: string) => ({ role: "user", content: s })));
    return { status: `Added ${statements.length} memories.` };
  }
);

// Similarly, you can add update and delete memory functions if needed.

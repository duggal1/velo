// history.ts
// Persistence layer for AgentKit conversation history using Prisma

import prisma from "@/lib/prisma";
import type {
  State,
  NetworkRun,
  AgentResult,
  getStepTools,
  StateData,
} from "@inngest/agent-kit";

// History adapter interface as per documentation
export interface HistoryConfig<T extends StateData = any> {
  createThread?: (ctx: {
    state: State<T>;
    input: string;
    network?: NetworkRun<T>;
    step?: ReturnType<typeof getStepTools>;
  }) => Promise<{ threadId: string }>;
  
  get?: (ctx: {
    threadId: string;
    state?: State<T>;
    input?: string;
    network?: NetworkRun<T>;
    step?: ReturnType<typeof getStepTools>;
  }) => Promise<AgentResult[]>;
  
  appendResults?: (ctx: {
    threadId: string;
    newResults: AgentResult[];
    userMessage?: { content: string; role: "user"; timestamp: Date };
    state?: State<T>;
    input?: string;
    network?: NetworkRun<T>;
    step?: ReturnType<typeof getStepTools>;
  }) => Promise<void>;
}

/**
 * History adapter for persisting conversation threads and messages.
 */
export const historyAdapter: HistoryConfig = {
  /**
   * Creates a new conversation thread (Project) when none exists.
   */
  createThread: async ({ state, input }) => {
    const project = await prisma.project.create({
      data: {
        name: input.slice(0, 50),
        userId: state.data.userId,
      },
    });
    return { threadId: project.id };
  },

  /**
   * Retrieves full conversation history for the given thread (Project).
   */
  get: async ({ threadId }) => {
    if (!threadId) return [];
    const messages = await prisma.message.findMany({
      where: { projectId: threadId },
      orderBy: { createdAt: "asc" },
    });
    
    // Transform to AgentResult format according to documentation
    return messages.map((msg: any) => {
      // Only include assistant messages in the history
      if (msg.role === "ASSISTANT") {
        return {
          agentName: "assistant", // Use the actual agent name if available
          output: [
            {
              type: "text" as const,
              role: "assistant" as const,
              content: msg.content,
            },
          ],
          toolCalls: [],
          createdAt: msg.createdAt,
        };
      } else {
        // For user messages, create a compatible format
        return {
          agentName: "user",
          output: [
            {
              type: "text" as const,
              role: "user" as const,
              content: msg.content,
            },
          ],
          toolCalls: [],
          createdAt: msg.createdAt,
        };
      }
    });
  },

  /**
   * Appends new user and assistant messages to the database after a run.
   */
  appendResults: async ({ threadId, newResults, userMessage }) => {
    if (!threadId) return;

    if (userMessage) {
      await prisma.message.create({
        data: {
          projectId: threadId,
          role: "USER",
          type: "RESULT",
          content: userMessage.content,
          createdAt: userMessage.timestamp,
        },
      });
    }

    for (const result of newResults) {
      const text = result.output.map((o: any) => o.content).join("\n");
      await prisma.message.create({
        data: {
          projectId: threadId,
          role: "ASSISTANT",
          type: "RESULT",
          content: text,
          createdAt: result.createdAt,
        },
      });
    }
  },
};

// history.ts
// Persistence layer for AgentKit conversation history using Prisma

import prisma from "@/lib/prisma";

// Local definition of HistoryConfig (not imported from @inngest/agent-kit)
interface HistoryConfig<T = any> {
  createThread?: (ctx: { state: any; input: string }) => Promise<{ threadId: string }>;
  get?: (ctx: { threadId: string; state?: any; input?: string; network?: any; step?: any }) => Promise<any[]>;
  appendResults?: (ctx: { threadId: string; newResults: any[]; userMessage?: any; state?: any; input?: string; network?: any; step?: any }) => Promise<void>;
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
    return messages.map((msg: any) => ({
      agentName: msg.role === "ASSISTANT" ? "assistant" : "user",
      output: [
        {
          type: "text" as const,
          role: msg.role === "ASSISTANT" ? "assistant" : "user",
          content: msg.content,
        },
      ],
      toolCalls: [],
      createdAt: msg.createdAt,
    }));
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

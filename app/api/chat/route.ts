import { tool, streamText, generateText, stepCountIs, convertToModelMessages } from 'ai';
import { z } from 'zod';
import { prisma } from '@/lib/prisma'; // Your Prisma client path

import { Priority, Status } from '@/generated/prisma/enums';
import { createOllama } from 'ollama-ai-provider-v2';
import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/serverSession';
import { TAuthUser, withAuth } from '@/lib/apiAuth';
import { mapChatHistory } from '@/lib/ai';

const ollama = createOllama({
  // optional settings, e.g.
  baseURL: process.env.OLLAMA_URL || 'http://localhost:11434/api',
});
export const GET = withAuth(async (req: Request, auth: TAuthUser) => {
  try {
    const histories = await prisma.chatHistory.findMany({
      where: {
        user_id: auth.user.id
      },
      include: {
        chatExecutionHistories: true
      },
      orderBy: {
        created_at: 'desc'
      },
      take: 20
    })

    histories.reverse()
    return NextResponse.json({
      message: "Success",
      data: histories
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Server Error" }, { status: 500 })
  }
})
export async function POST(req: Request) {
  try {
    const { text: prompt, messages } = await req.json();
    const session = await getServerSession()
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    const userId = Number(session.user.id);

    // 1. Save the User's Message immediately
    await prisma.chatHistory.create({
      data: {
        user_id: userId,
        role: 'user',
        content: prompt,
      },
    });
    let aiChatId: number | null = null
    const toolsResult: { method: string, task_id: number | null, payload: any } = {
      method: '',
      task_id: null,
      payload: {}
    }
    const result = await streamText({
      model: ollama(process.env.OLLAMA_MODEL!),
      system: `
You are a task assistant.

Rules:
- Use tools whenever needed.
- Do NOT explain before calling a tool.
- Call the tool directly.
- After receiving tool results, summarize them for the user.

If multiple tasks match, list them clearly.
`,
      messages: await convertToModelMessages(messages.slice(-20)),
      tools: {
        createTask: tool({
          description: "Create task from user description",
          inputSchema: z.object({
            title: z.string(),
            priority: z.enum(["Urgent", "High", "Medium", "Low"])
              .describe('The priority of task'),
            content: z.string().describe("The actual content of task"),
            date: z.string()
              .describe('ISO 8601 date string (e.g., 2026-03-16T13:10:00Z). Optional.')
              .optional(),
          }),
          execute: async (payload) => {
            const { content, priority, title, date } = payload
            const inputDate = date ? new Date(date) : new Date()
            const task = await prisma.task.create({
              data: {
                user_id: userId,
                date: inputDate,
                title, content, priority
              }
            })
            toolsResult.method = 'CREATE';
            toolsResult.task_id = task.id;
            toolsResult.payload = payload
          }
        }),
        searchTasks: tool({
          description: "Search tasks by keyword",
          inputSchema: z.object({
            query: z.string(),
            priority: z.enum(["Urgent", "High", "Medium", "Low"]).optional(),
          }),
          execute: async ({ query, priority }) => {
            const tasks = await prisma.task.findMany({
              where: {
                user_id: userId,

                ...(priority && { priority }),

                ...(query && {
                  OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { content: { contains: query, mode: "insensitive" } },
                  ],
                }),
              },
            });
            toolsResult.method = "SEARCH_TASKS";
            toolsResult.payload = { query, priority };

            return tasks;
          },
        }),
        getTasks: tool({
          description: "Get user's tasks with optional filters",
          inputSchema: z.object({
            date_from: z.string().optional(),
            date_to: z.string().optional(),
            priority: z.enum(["Urgent", "High", "Medium", "Low"]).optional(),
            keyword: z.string().optional(),
          }),
          execute: async ({ date_from, date_to, priority, keyword }) => {
            const tasks = await prisma.task.findMany({
              where: {
                user_id: userId,
                ...(priority && { priority }),
                ...(date_from || date_to
                  ? {
                    date: {
                      ...(date_from && { gte: new Date(date_from) }),
                      ...(date_to && { lte: new Date(date_to) }),
                    },
                  }
                  : {}),
                ...(keyword && {
                  OR: [
                    { title: { contains: keyword, mode: "insensitive" } },
                    { content: { contains: keyword, mode: "insensitive" } },
                  ],
                }),
              },
              orderBy: { date: "asc" },
            });

            toolsResult.method = "GET_TASKS";
            toolsResult.payload = { date_from, date_to, priority, keyword };

            return tasks; // IMPORTANT: return result for LLM
          },
        }),
        requestDeleteTask: tool({
          description: "Request deletion of a task. Search the task using a query and ask for confirmation before deleting.",
          inputSchema: z.object({
            query: z.string().describe("Keyword or phrase to identify the task to delete")
          }),
          execute: async ({ query }) => {

            const tasks = await prisma.task.findMany({
              where: {
                user_id: userId,
                OR: [
                  { title: { contains: query, mode: "insensitive" } },
                  { content: { contains: query, mode: "insensitive" } },
                ]
              },
              take: 5
            })

            if (tasks.length === 0) {
              return {
                error: `No tasks found matching "${query}".`
              }
            }

            // If multiple tasks match, let the AI ask the user which one
            if (tasks.length > 1) {
              return {
                requiresDisambiguation: true,
                tasks
              }
            }

            const task = tasks[0]

            toolsResult.method = "REQUEST_DELETE_TASK"
            toolsResult.task_id = task.id
            toolsResult.payload = { query }

            return {
              requiresConfirmation: true,
              task
            }
          }
        }),
        deleteTask: tool({
          description: "Delete a task after user confirmation",
          inputSchema: z.object({
            task_id: z.number()
          }),
          execute: async ({ task_id }) => {

            const task = await prisma.task.delete({
              where: {
                id: task_id,
                user_id: userId
              }
            })

            toolsResult.method = "DELETE_TASK"
            toolsResult.task_id = task_id

            return {
              success: true,
              deletedTask: task
            }
          }
        })
      },
      stopWhen: stepCountIs(7),
      onFinish: async ({ text }) => {
        const chat = await prisma.chatHistory.create({
          data: {
            user_id: userId,
            role: 'assistant',
            content: text,
          },
        });
        aiChatId = chat.id
        if (aiChatId) {
          // save instruction
          await prisma.chatExecutionHistory.create({
            data: {
              chat_id: aiChatId,
              method: toolsResult.method,
              task_id: toolsResult.task_id,
              payload: toolsResult.payload,
            }
          })
        }
      }
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Server Error" }, { status: 500 })
  }
}
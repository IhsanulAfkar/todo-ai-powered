import { TChat } from "@/hooks/datasource/useChatHistory"
import { UIMessage } from "ai"

export function mapChatHistory(chats: TChat[]): UIMessage[] {
  return chats.map((chat) => ({
    id: String(chat.id),
    role: chat.role,
    parts: [
      {
        type: "text",
        text: chat.content
      }
    ],

    toolInvocations: chat.chatExecutionHistories?.map(exec => ({
      toolCallId: `tool-${exec.id}`,
      toolName: exec.method,
      state: "result",
      args: exec.payload,
      result: {
        tasks: exec.tasks
      }
    }))
  }))
}
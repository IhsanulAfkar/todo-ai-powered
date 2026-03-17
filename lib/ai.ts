import { UIMessage } from "ai"

export function mapChatHistory(chats: any[]): UIMessage[] {
  return chats.map((chat) => ({
    id: String(chat.id),
    role: chat.role,
    parts: [
      {
        type: "text",
        text: chat.content
      }
    ],

    toolInvocations: chat.chatExecutionHistories?.map((exec: any) => ({
      toolCallId: `tool-${exec.id}`,
      toolName: exec.method,
      state: "result",
      args: exec.payload,
      result: {
        task_id: exec.task_id
      }
    }))
  }))
}
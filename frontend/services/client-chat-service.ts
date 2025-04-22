import { API_ENDPOINTS } from "@/config"
import type { Message } from "ai"

export class ClientChatService {
  /**
   * Send a message to the chat API
   */
  static async sendMessage(messages: Message[]): Promise<Response> {
    try {
      return await fetch(API_ENDPOINTS.chat, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      })
    } catch (error) {
      console.error("Error sending message:", error)
      throw error
    }
  }
}

import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import type { Message } from "ai"
import { AI_CONFIG } from "@/config"

export interface ChatRequest {
  messages: Message[]
}

export interface ChatResponse {
  toDataStreamResponse: () => Response
}

export class ChatService {
  /**
   * Send a chat request to the AI model and get a streaming response
   */
  static async sendChatRequest(request: ChatRequest): Promise<ChatResponse> {
    const result = streamText({
      model: openai(AI_CONFIG.model),
      messages: request.messages,
      system: AI_CONFIG.systemPrompt,
    })

    return result
  }

  /**
   * Extract references from message content
   */
  static extractReferences(content: string): { content: string; references: string[] | null } {
    // Check if the message contains references section
    const referencePattern = /\n\nReferences:\n([\s\S]+)$/
    const match = content.match(referencePattern)

    if (match) {
      // Extract references and clean up the content
      const referencesText = match[1]
      const cleanContent = content.replace(referencePattern, "")

      // Parse references into an array
      const references = referencesText
        .split("\n")
        .map((ref) => ref.trim())
        .filter((ref) => ref.length > 0 && ref.startsWith("-"))
        .map((ref) => ref.substring(1).trim()) // Remove the leading dash

      return { content: cleanContent, references }
    }

    return { content, references: null }
  }
}

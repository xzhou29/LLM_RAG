import { API_ENDPOINTS } from "@/config"
import type { Message } from "ai"

/**
 * API Service - Centralizes all API calls to the backend
 */
export class ApiService {
  /**
   * Base URL for the API
   */
  private static baseUrl = API_ENDPOINTS.baseUrl

  /**
   * Headers used for JSON requests
   */
  private static jsonHeaders = {
    "Content-Type": "application/json",
  }

  /**
   * Send a chat message to the backend
   */
  static async sendChatMessage(messages: Message[], sessionId: string): Promise<Response> {
    try {
      return await fetch(`${this.baseUrl}/chat`, {
        method: "POST",
        headers: this.jsonHeaders,
        body: JSON.stringify({
          messages,
          sessionId,
        }),
      })
    } catch (error) {
      console.error("Error sending chat message:", error)
      throw error
    }
  }

  /**
   * Upload a file to the backend
   */
  static async uploadFile(file: File, sessionId: string): Promise<any> {
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("sessionId", sessionId)

      const response = await fetch(`${this.baseUrl}/upload`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to upload file")
      }

      return await response.json()
    } catch (error) {
      console.error("Error uploading file:", error)
      throw error
    }
  }

  /**
   * Analyze file content using the backend
   */
  static async analyzeFile(fileContent: string, fileName: string, sessionId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/analyze-file`, {
        method: "POST",
        headers: this.jsonHeaders,
        body: JSON.stringify({
          fileContent,
          fileName,
          sessionId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to analyze file")
      }

      return await response.json()
    } catch (error) {
      console.error("Error analyzing file:", error)
      throw error
    }
  }

  /**
   * Get chat history from the backend
   */
  static async getChatHistory(sessionId: string): Promise<Message[] | null> {
    try {
      const response = await fetch(`${this.baseUrl}/chat-history/${sessionId}`, {
        method: "GET",
        headers: this.jsonHeaders,
      })

      if (!response.ok) {
        // If 404 or other error, return null (no history)
        return null
      }

      const data = await response.json()
      return data.messages || null
    } catch (error) {
      console.error("Error getting chat history:", error)
      return null
    }
  }
}

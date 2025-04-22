import { sampleResponses } from "@/utils/sample-responses"
import type { Message } from "ai"

/**
 * Service to simulate backend responses using sample data
 */
export class SampleResponseService {
  /**
   * Get a random sample response
   */
  static getRandomResponse(userMessage: string): Promise<Message> {
    // Get all assistant responses from sample data
    const assistantResponses = sampleResponses.filter((msg) => msg.role === "assistant")

    // Select a random response
    const randomIndex = Math.floor(Math.random() * assistantResponses.length)
    const response = assistantResponses[randomIndex]

    // Simulate network delay (1-2 seconds)
    return new Promise((resolve) => {
      setTimeout(
        () => {
          resolve({
            id: Date.now().toString(),
            role: "assistant",
            content: response.content,
          })
        },
        1000 + Math.random() * 1000,
      )
    })
  }

  /**
   * Parse a response into content and references as a simple list of strings
   */
  static parseResponse(content: string): {
    responseText: string
    references: string[] | null
  } {
    // Extract references section
    const referencePattern = /\n\nReferences:\n([\s\S]+)$/
    const match = content.match(referencePattern)

    if (!match) {
      return { responseText: content, references: null }
    }

    // Get clean response text without references
    const responseText = content.replace(referencePattern, "")

    // Extract references as simple strings without parsing
    const referencesText = match[1]
    const references = referencesText
      .split("\n")
      .map((ref) => ref.trim())
      .filter((ref) => ref.length > 0 && ref.startsWith("-"))
      .map((ref) => ref.substring(1).trim()) // Remove the leading dash

    return { responseText, references }
  }
}

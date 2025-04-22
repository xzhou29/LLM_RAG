import { v4 as uuidv4 } from "uuid"

/**
 * Session Service - Handles session management
 */
export class SessionService {
  /**
   * Get the current session ID from localStorage or create a new one
   */
  static getSessionId(): string {
    if (typeof window === "undefined") {
      return ""
    }

    const storedSessionId = localStorage.getItem("chatSessionId")

    if (storedSessionId) {
      return storedSessionId
    }

    // Generate a new session ID if none exists
    const newSessionId = uuidv4()
    localStorage.setItem("chatSessionId", newSessionId)
    return newSessionId
  }
}

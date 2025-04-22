// Determine if we're running in development or production
const isDevelopment = process.env.NODE_ENV === "development"

// Base URL configuration
const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  (isDevelopment ? "http://localhost:3000/api" : "https://your-production-domain.com/api")

// API endpoints
export const API_ENDPOINTS = {
  baseUrl,
  chat: `${baseUrl}/chat`,
  upload: `${baseUrl}/upload`,
  analyzeFile: `${baseUrl}/analyze-file`,
  chatHistory: `${baseUrl}/chat-history`,
}

// AI model configuration - only used on the server
export const AI_CONFIG = {
  model: "gpt-4-turbo",
  systemPrompt: `You are a helpful AI assistant that provides informative responses with references.
    
  When providing information, include relevant references at the end of your response in this format:
  
  References:
  - Reference 1
  - Reference 2
  - https://example.com/relevant-link
  
  Keep your responses concise and focused on the user's query.`,
}

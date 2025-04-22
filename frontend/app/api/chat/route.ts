import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import type { NextRequest } from "next/server"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: NextRequest) {
  const { messages, sessionId } = await req.json()

  // Log the session ID for tracking purposes
  console.log(`Processing chat request for session: ${sessionId || "unknown"}`)

  // All model inference happens here on the server
  const result = streamText({
    model: openai("gpt-4-turbo"),
    messages,
    system: `You are a helpful AI assistant that provides informative responses with references.
    
    When providing information, include relevant references at the end of your response in this format:
    
    References:
    - Reference 1
    - Reference 2
    - https://example.com/relevant-link
    
    Keep your responses concise and focused on the user's query.
    
    ${sessionId ? `This conversation is part of session: ${sessionId}` : ""}`,
  })

  return result.toDataStreamResponse()
}

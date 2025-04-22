import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  const { fileContent, fileName, sessionId } = await req.json()

  if (!fileContent || !fileName) {
    return Response.json({ error: "Missing file content or file name" }, { status: 400 })
  }

  try {
    // Use the AI model on the backend to analyze the file
    const { text } = await generateText({
      model: openai("gpt-4-turbo"),
      prompt: `Analyze the following ZIP file contents and provide a helpful summary:
      
      File Name: ${fileName}
      Session ID: ${sessionId || "unknown"}
      
      Contents:
      ${fileContent}
      
      Please provide a concise summary of what this ZIP file contains and what the user might want to know about it.`,
      system: "You are a helpful AI assistant that specializes in analyzing file contents.",
    })

    return Response.json({
      analysis: text,
      fileName,
      sessionId,
    })
  } catch (error) {
    console.error("Error analyzing file:", error)
    return Response.json({ error: error instanceof Error ? error.message : "Failed to analyze file" }, { status: 500 })
  }
}

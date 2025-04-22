"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { Message } from "ai"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send, Upload, Sparkles, Menu } from "lucide-react"
import ChatMessage from "@/components/chat-message"
import FileUploader from "@/components/file-uploader"
import { Modal } from "@/components/ui/modal"
import { SessionService } from "@/services/session-service"
import { SampleResponseService } from "@/services/sample-response-service"

export default function ChatPage() {
  const [mounted, setMounted] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [sessionId, setSessionId] = useState("")
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize session ID on mount
  useEffect(() => {
    const sid = SessionService.getSessionId()
    setSessionId(sid)
    setMounted(true)
    setIsLoadingHistory(false) // Simulate loading history
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isProcessing) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsProcessing(true)

    // Simulate getting response from backend
    try {
      const response = await SampleResponseService.getRandomResponse(input)
      setMessages((prev) => [...prev, response])
    } catch (error) {
      console.error("Error getting response:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileProcessed = (fileContent: string, fileName: string, uploadId: string, analysis: string) => {
    // Add messages with the file content and AI analysis
    const newMessages: Message[] = [
      ...messages,
      {
        id: Date.now().toString(),
        role: "user",
        content: `I've uploaded a ZIP file: ${fileName} (Upload ID: ${uploadId}, Session ID: ${sessionId})`,
      },
      {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `${analysis}

\`\`\`
${fileContent}
\`\`\`

What would you like to know about this file?`,
      },
    ]

    setMessages(newMessages)
    setIsUploadModalOpen(false)

    // Scroll to the bottom after adding new messages
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  if (!mounted) return null

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm py-4 px-6 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 sticky top-0 z-10">
        <div className="flex justify-between items-center max-w-[1400px] mx-auto w-full">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-indigo-500" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              AI Assistant with RAG
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-mono">
              {sessionId.substring(0, 8)}...
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-1 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-all duration-200"
            >
              <Upload className="h-4 w-4 text-indigo-500" />
              <span className="text-indigo-600 dark:text-indigo-400">Upload ZIP</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col p-3 md:p-6 max-w-[1400px] mx-auto w-full">
        <Card className="flex-1 overflow-hidden flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg w-full">
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {isLoadingHistory ? (
              <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="text-gray-500 dark:text-gray-400">Loading chat history...</p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="max-w-3xl space-y-6 w-full">
                  <div className="h-24 w-24 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg mb-4">
                    <Sparkles className="h-12 w-12 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Welcome to AI Chat</h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    Ask me anything and I'll provide answers with references when available.
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    You can also upload ZIP files to analyze their contents.
                  </p>

                  <div className="flex justify-center mt-8">
                    <Button
                      onClick={() => setInput("What are the benefits of meditation?")}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200 px-6 py-3 rounded-full"
                    >
                      Start a conversation
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8 max-w-[1200px] mx-auto w-full">
                {messages.map((message: Message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 p-4 md:p-6 bg-gray-50 dark:bg-gray-900 rounded-b-xl">
            <form onSubmit={handleSubmit} className="flex space-x-2 max-w-[1200px] mx-auto w-full">
              <div className="relative flex-1">
                <input
                  className="w-full min-w-0 rounded-full border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-400 dark:focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 dark:bg-gray-800 transition-all duration-200"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoadingHistory || isProcessing}
                />
                {isProcessing && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <Button
                type="submit"
                disabled={isLoadingHistory || isProcessing || !input.trim()}
                className="rounded-full w-12 h-12 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:shadow-none"
              >
                <Send className="h-5 w-5" />
                <span className="sr-only">{isProcessing ? "Processing..." : "Send message"}</span>
              </Button>
            </form>
          </div>
        </Card>
      </main>

      {/* File Upload Modal */}
      <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="Upload ZIP File">
        <FileUploader onFileProcessed={handleFileProcessed} sessionId={sessionId} />
      </Modal>
    </div>
  )
}

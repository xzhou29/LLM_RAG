"use client"

import type { Message } from "ai"
import { User, Bot } from "lucide-react"
import ReactMarkdown from "react-markdown"
import References from "./references"
import { SampleResponseService } from "@/services/sample-response-service"
import { motion } from "framer-motion"

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  // Only process assistant messages for references
  if (message.role === "assistant") {
    const { responseText, references } = SampleResponseService.parseResponse(message.content)

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex w-full justify-start"
      >
        <div className="flex flex-row max-w-[95%] w-full">
          <div className="flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 mr-3 self-start mt-1 shadow-md">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div className="overflow-hidden rounded-2xl px-6 py-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm w-full">
            <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-indigo-700 dark:prose-headings:text-indigo-300 prose-a:text-indigo-600 dark:prose-a:text-indigo-400">
              <ReactMarkdown>{responseText}</ReactMarkdown>
            </div>

            {references && references.length > 0 && <References references={references} />}
          </div>
        </div>
      </motion.div>
    )
  }

  // User message (no references)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex w-full justify-end"
    >
      <div className="flex flex-row-reverse max-w-[85%]">
        <div className="flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 ml-3 self-start mt-1 shadow-md">
          <User className="h-5 w-5 text-white" />
        </div>
        <div className="overflow-hidden rounded-2xl px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md">
          <div className="prose prose-lg max-w-none prose-invert">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

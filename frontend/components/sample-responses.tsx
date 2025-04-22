"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { sampleResponses } from "@/utils/sample-responses"
import ChatMessage from "@/components/chat-message"
import type { Message } from "ai"
import { ChevronRight, Lightbulb } from "lucide-react"

export default function SampleResponses() {
  const [sampleIndex, setSampleIndex] = useState(0)

  // Get the current conversation pair (user question and AI response)
  const getCurrentSamplePair = (): Message[] => {
    if (sampleIndex >= sampleResponses.length / 2) {
      return []
    }

    const startIndex = sampleIndex * 2
    return [sampleResponses[startIndex], sampleResponses[startIndex + 1]]
  }

  const handleNextSample = () => {
    const nextIndex = sampleIndex + 1
    if (nextIndex < sampleResponses.length / 2) {
      setSampleIndex(nextIndex)
    } else {
      setSampleIndex(0)
    }
  }

  const currentPair = getCurrentSamplePair()

  return (
    <div className="space-y-6 my-6 border rounded-xl p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-md w-full">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
          Example Response with References
        </h3>
      </div>

      <div className="space-y-8">
        {currentPair.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>

      <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          onClick={handleNextSample}
          variant="outline"
          size="sm"
          className="group border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50"
        >
          Show Next Example
          <ChevronRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
        </Button>
        <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
          Example {sampleIndex + 1} of {sampleResponses.length / 2}
        </div>
      </div>
    </div>
  )
}

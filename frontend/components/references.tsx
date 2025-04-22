"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, ExternalLink, BookOpen } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ReferencesProps {
  references: string[]
}

export default function References({ references }: ReferencesProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 text-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-200 font-medium"
        aria-expanded={isExpanded}
      >
        <span className="flex items-center">
          <BookOpen className="h-4 w-4 mr-2" />
          References ({references.length})
        </span>
        {isExpanded ? (
          <ChevronUp className="ml-2 h-4 w-4 transition-transform duration-200" />
        ) : (
          <ChevronDown className="ml-2 h-4 w-4 transition-transform duration-200" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-2 pl-2">
              {references.map((reference, index) => {
                const isUrl = reference.startsWith("http://") || reference.startsWith("https://")

                return (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    {isUrl ? (
                      <div className="flex items-start">
                        <ExternalLink className="h-4 w-4 text-indigo-500 mr-2 flex-shrink-0 mt-0.5" />
                        <a
                          href={reference}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline"
                        >
                          {truncateUrl(reference)}
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-start">
                        <BookOpen className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-800 dark:text-gray-200">{reference}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Helper function to truncate long URLs for display
function truncateUrl(url: string, maxLength = 60): string {
  return url.length > maxLength ? url.substring(0, maxLength) + "..." : url
}

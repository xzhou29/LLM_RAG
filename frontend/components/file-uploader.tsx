"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, File, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ApiService } from "@/services/api-service"
import { motion } from "framer-motion"

interface FileUploaderProps {
  onFileProcessed: (fileContent: string, fileName: string, uploadId: string, analysis: string) => void
  sessionId: string
}

export default function FileUploader({ onFileProcessed, sessionId }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const processFile = async (file: File) => {
    if (!file.name.endsWith(".zip")) {
      setErrorMessage("Please upload a ZIP file")
      setUploadStatus("error")
      return
    }

    setFile(file)
    setIsUploading(true)
    setUploadStatus("idle")
    setErrorMessage("")

    try {
      // Step 1: Upload the file using the API service
      const uploadData = await ApiService.uploadFile(file, sessionId)

      // Step 2: Analyze the file content using the API service
      const analyzeData = await ApiService.analyzeFile(uploadData.content, uploadData.fileName, sessionId)

      setUploadStatus("success")

      // Pass both the raw content and the AI analysis to the parent component
      onFileProcessed(uploadData.content, uploadData.fileName, uploadData.uploadId, analyzeData.analysis)
    } catch (error) {
      console.error("Upload error:", error)
      setUploadStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to upload file")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      processFile(droppedFile)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      processFile(selectedFile)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleClearFile = () => {
    setFile(null)
    setUploadStatus("idle")
    setErrorMessage("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".zip"
        className="hidden"
        id="file-upload"
      />

      {!file ? (
        <motion.div
          whileHover={{ scale: 1.01 }}
          className={`border-2 border-dashed rounded-xl p-8 text-center ${
            isDragging
              ? "border-indigo-400 bg-indigo-50 dark:border-indigo-600 dark:bg-indigo-900/20"
              : "border-gray-300 dark:border-gray-600"
          } transition-colors duration-200 cursor-pointer`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <Upload className="h-8 w-8 text-indigo-500" />
            </div>
            <p className="text-lg font-medium text-gray-800 dark:text-gray-100">Drag and drop your ZIP file here</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">or click to browse</p>
            <Button
              variant="outline"
              type="button"
              className="mt-2 bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-all duration-200"
            >
              Select ZIP File
            </Button>
          </div>
        </motion.div>
      ) : (
        <div className="border rounded-xl p-5 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <File className="h-6 w-6 text-indigo-500" />
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-100">{file.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {isUploading ? (
                <div className="flex items-center text-indigo-600 dark:text-indigo-400">
                  <div className="h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span>Processing...</span>
                </div>
              ) : uploadStatus === "success" ? (
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <Check className="h-5 w-5 mr-1" />
                  <span>Processed</span>
                </div>
              ) : uploadStatus === "error" ? (
                <div className="flex items-center text-red-600 dark:text-red-400">
                  <AlertCircle className="h-5 w-5 mr-1" />
                  <span>Failed</span>
                </div>
              ) : null}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFile}
                disabled={isUploading}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full h-8 w-8 p-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          {uploadStatus === "error" && errorMessage && (
            <div className="mt-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              {errorMessage}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

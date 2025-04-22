import { type NextRequest, NextResponse } from "next/server"
import { join } from "path"
import { mkdir, writeFile } from "fs/promises"
import { existsSync } from "fs"
import * as AdmZip from "adm-zip"
import { v4 as uuidv4 } from "uuid"

// Set the maximum file size (10MB)
export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(request: NextRequest) {
  try {
    // Get form data (file and sessionId)
    const formData = await request.formData()
    const file = formData.get("file") as File
    const sessionId = (formData.get("sessionId") as string) || "default-session"

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.name.endsWith(".zip")) {
      return NextResponse.json({ message: "Only ZIP files are allowed" }, { status: 400 })
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ message: "File size exceeds 10MB limit" }, { status: 400 })
    }

    // Create a unique upload directory with sessionId included in the path
    const uploadId = uuidv4()
    const sessionDir = join(process.cwd(), "uploads", sessionId)
    const uploadDir = join(sessionDir, uploadId)

    // Create directories if they don't exist
    if (!existsSync(join(process.cwd(), "uploads"))) {
      await mkdir(join(process.cwd(), "uploads"), { recursive: true })
    }

    if (!existsSync(sessionDir)) {
      await mkdir(sessionDir, { recursive: true })
    }

    await mkdir(uploadDir, { recursive: true })

    // Save the file
    const buffer = Buffer.from(await file.arrayBuffer())
    const filePath = join(uploadDir, file.name)
    await writeFile(filePath, buffer)

    // Extract the ZIP file
    const zip = new AdmZip(filePath)
    const extractDir = join(uploadDir, "extracted")
    zip.extractAllTo(extractDir, true)

    // Get a summary of the ZIP contents
    const entries = zip.getEntries()
    const fileList = entries.map((entry) => ({
      name: entry.name,
      path: entry.entryName,
      isDirectory: entry.isDirectory,
      size: entry.header.size,
    }))

    // Generate a simple text summary without AI inference
    const summary = `
      ZIP File: ${file.name}
      Session ID: ${sessionId}
      Upload ID: ${uploadId}
      Total Files: ${entries.filter((e) => !e.isDirectory).length}
      Total Directories: ${entries.filter((e) => e.isDirectory).length}
      
      File List:
      ${fileList.map((f) => `- ${f.path} ${f.isDirectory ? "(Directory)" : `(${(f.size / 1024).toFixed(2)} KB)`}`).join("\n")}
    `

    return NextResponse.json({
      message: "File uploaded and processed successfully",
      uploadId,
      sessionId,
      fileCount: entries.length,
      content: summary,
      fileName: file.name,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to process file" },
      { status: 500 },
    )
  }
}

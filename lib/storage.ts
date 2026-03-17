import fs from "fs"
import path from "path"

export async function saveTaskImage(
  file: File,
  userId: number
): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const filename = `${Date.now()}-${file.name}`

  const uploadDir = path.join(
    process.cwd(),
    "uploads",
    "users",
    String(userId),
    "tasks"
  )

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  const filePath = path.join(uploadDir, filename)

  fs.writeFileSync(filePath, buffer)

  return `/uploads/users/${userId}/tasks/${filename}`
}
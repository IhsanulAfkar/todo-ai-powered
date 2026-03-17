import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { saveTaskImage } from "@/lib/storage"
import Joi from "joi"
import { TAuthUser, withAuth } from "@/lib/apiAuth"
export const createTaskSchema = Joi.object({
  title: Joi.string().required(),
  priority: Joi.string()
    .valid("Urgent", "High", "Medium", "Low")
    .required(),
  content: Joi.string().allow("").optional(),
  date: Joi.date().iso().required(),
})
export const POST = withAuth(async (req: NextRequest) => {
  try {
    const formData = await req.formData()

    const title = formData.get("title")
    const priority = formData.get("priority")
    const content = formData.get("content")
    const date = formData.get("date")
    const thumbnail = formData.get("thumbnail") as File | null

    // Normally from session
    const userId = 1

    const { error, value } = createTaskSchema.validate({
      title,
      priority,
      content,
      date,
    })

    if (error) {
      return NextResponse.json(
        { message: error.details[0].message },
        { status: 400 }
      )
    }

    let thumbnailPath = null

    if (thumbnail && thumbnail.size > 0) {
      thumbnailPath = await saveTaskImage(thumbnail, userId)
    }

    const task = await prisma.task.create({
      data: {
        title: value.title,
        priority: value.priority,
        content: value.content,
        date: new Date(value.date),
        user_id: userId,
        images: thumbnailPath
          ? {
            create: {
              file_path: thumbnailPath,
              is_thumbnail: true,
            },
          }
          : undefined,
      },
      include: {
        images: true,
      },
    })

    return NextResponse.json({
      message: "Task created",
      data: task,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
})
export const GET = withAuth(async (req: NextRequest, auth: TAuthUser) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        user_id: auth.user.id
      },
      include: {
        images: true
      }
    })
    return NextResponse.json({ message: 'success', data: tasks })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 })
  }
})
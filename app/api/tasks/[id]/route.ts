import { TAuthUser, withAuth } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export const GET = withAuth<{ id: string }>(async (req: NextRequest, auth: TAuthUser, { params }) => {
  try {
    const { id } = await params
    const task = await prisma.task.findFirst({
      where: { id: Number(id), user_id: auth.user.id },
      include: {
        images: true
      }
    })
    if (!task) return NextResponse.json({ message: "No Task Found" }, { status: 404 })
    return NextResponse.json({ message: 'Success', data: task })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Server Error' }, { status: 500 })
  }
})
export const PUT = withAuth<{ id: string }>(async (req: NextRequest, auth: TAuthUser, { params }) => {
  try {
    const { id } = await params
    const { status } = await req.json()
    if (!['Pending', 'Ongoing', 'Completed'].includes(status)) {
      return NextResponse.json({ message: "Invalid Status" }, { status: 400 })
    }
    const task = await prisma.task.findFirst({
      where: { id: Number(id), user_id: auth.user.id }
    })
    if (!task) return NextResponse.json({ message: "No Task Found" }, { status: 404 })
    await prisma.task.update({
      where: {
        id: task.id
      },
      data: {
        status
      }
    })
    return NextResponse.json({ message: "Success update task status" })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 })
  }
})
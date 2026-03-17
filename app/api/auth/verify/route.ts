import { prisma } from "@/lib/prisma"
import { validate } from "@/lib/validator"
import Joi from "joi"
import { NextResponse } from "next/server"
const verifyCodeSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().length(6).required()
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { email, code } = validate<{
      email: string
      code: string
    }>(verifyCodeSchema, body)

    const verification = await prisma.verificationCode.findFirst({
      where: {
        email,
        code
      }
    })

    if (!verification) {
      return NextResponse.json(
        { message: "Invalid verification code" },
        { status: 400 }
      )
    }

    if (verification.expires_at < new Date()) {
      return NextResponse.json(
        { message: "Verification code expired" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        is_verified: true
      }
    })

    await prisma.verificationCode.deleteMany({
      where: {
        email
      }
    })

    return NextResponse.json({
      message: "Email successfully verified"
    })

  } catch (error: any) {
    console.error(error)

    return NextResponse.json(
      { message: error.message || "Server Error" },
      { status: 400 }
    )
  }
}
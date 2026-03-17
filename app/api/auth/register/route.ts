import { hashPassword } from "@/lib/bcrypt"
import { prisma } from "@/lib/prisma"
import { generateCode } from "@/lib/utils"
import { validate } from "@/lib/validator"
import { sendEmail, verificationCodeTemplate } from "@/service/email"
import Joi from "joi"
import { NextResponse } from "next/server"
const registerSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
})
export async function POST(req: Request) {
    try {
        const body = await req.json()

        const { name, email, password } = validate<{ name: string; email: string, password: string }>(
            registerSchema,
            body
        )

        if (!name || !email) {
            return NextResponse.json(
                { message: 'Name and email are required' },
                { status: 400 }
            )
        }

        // check if user exists
        let user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: await hashPassword(password)
                }
            })
        } else {
            // check if same user name
            if (user.name != name) {
                return NextResponse.json({
                    message: "User not found"
                }, {
                    status: 404
                })
            }
        }
        const code = generateCode()

        const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

        await prisma.verificationCode.create({
            data: {
                email,
                code,
                expires_at: expiresAt,
                user_id: user.id
            }
        })

        // TODO: send email here
        console.log(`Verification code for ${email}: ${code}`)
        await sendEmail({
            html: verificationCodeTemplate(code),
            subject: "Verification Code",
            to: email
        })
        return NextResponse.json({
            message: 'Verification code sent',
            data: {
                email
            }
        })

    } catch (error) {
        console.error(error)

        return NextResponse.json(
            { message: 'Server Error' },
            { status: 500 }
        )
    }
}
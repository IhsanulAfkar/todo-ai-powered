import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
}: {
  to: string, subject: string, html: string, text?: string
}) => {
  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    text,
    html,
  })

  return info
}
export const verificationCodeTemplate = (code: string) => {
  return `
  <p>Thank you for registering.</p>
  <p>
    Use the verification code below to complete your registration:
  </p>
  <div
    style="
      font-size:28px;
      font-weight:bold;
      letter-spacing:6px;
      background:#f3f4f6;
      padding:16px;
      text-align:center;
      border-radius:8px;
      margin:20px 0;
    "
  >
    ${code}
  </div>

  <p>
    This code will expire in <strong>10 minutes</strong>.
  </p>

  <p>
    If you did not request this verification, please ignore this email.
  </p>
</div>

`
}
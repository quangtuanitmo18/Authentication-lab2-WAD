import fs from 'fs'
import nodemailer from 'nodemailer'
import path from 'path'
import { envConfig } from '~/constants/config'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'

interface EmailOptions {
  to: string
  subject: string
  text: string
  html?: string
}

const verifyEmailTemplate = fs.readFileSync(path.resolve('src/templates/verify-email.html'), 'utf8')

const transporter = nodemailer.createTransport({
  host: envConfig.mailerHost,
  port: Number(envConfig.mailerPort),
  secure: false,
  auth: {
    user: envConfig.mailerUserEmail,
    pass: envConfig.mailerUserPass
  }
})

// Hàm gửi email
export const sendEmail = async ({ to, subject, text, html }: EmailOptions): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html
    })
    console.log(`Message sent: ${info.messageId}`)
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

export const sendVerifyRegisterEmail = async (
  toAddress: string,
  email_verify_token: string,
  template: string = verifyEmailTemplate
) => {
  try {
    console.log(envConfig.mailerUserEmail, envConfig.mailerUserPass, '-------------------')

    const info = await transporter.sendMail({
      from: envConfig.mailerUserEmail,
      to: toAddress,
      subject: 'Email Verification',
      html: template
        .replace('{{title}}', 'Please verify your email')
        .replace('{{content}}', 'Click the button below to verify your email')
        .replace('{{titleLink}}', 'Verify')
        .replace('{{link}}', `${envConfig.clientUrl}/email-verifications?token=${email_verify_token}`)
    })

    console.log('Email sent:', info.messageId)
  } catch (error) {
    console.error('Error sending email:', error)
    throw new ErrorWithStatus({ message: 'Send email failed', status: HTTP_STATUS.BAD_REQUEST })
  }
}

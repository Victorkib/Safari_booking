import nodemailer from 'nodemailer'
import { getEmailFromRaw } from '../config'

export type GmailSendInput = {
  to: string
  subject: string
  html: string
}

function getGmailTransporter() {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, '')

  if (!user || !pass) {
    throw new Error('Gmail SMTP is not configured')
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })
}

export async function sendViaGmail({ to, subject, html }: GmailSendInput): Promise<void> {
  const transporter = getGmailTransporter()

  await transporter.sendMail({
    from: getEmailFromRaw(),
    to,
    subject,
    html,
  })
}

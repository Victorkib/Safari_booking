import { parseFromAddress } from '../config'

export type MailjetSendInput = {
  to: string
  subject: string
  html: string
}

export async function sendViaMailjet({ to, subject, html }: MailjetSendInput): Promise<void> {
  const apiKey = process.env.MAILJET_API_KEY
  const secretKey = process.env.MAILJET_SECRET_KEY

  if (!apiKey || !secretKey) {
    throw new Error('Mailjet is not configured')
  }

  const from = parseFromAddress()
  const auth = Buffer.from(`${apiKey}:${secretKey}`).toString('base64')

  const response = await fetch('https://api.mailjet.com/v3.1/send', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Messages: [
        {
          From: { Email: from.email, Name: from.name },
          To: [{ Email: to }],
          Subject: subject,
          HTMLPart: html,
        },
      ],
    }),
    cache: 'no-store',
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Mailjet send failed (${response.status}): ${body}`)
  }
}

export type ParsedFromAddress = {
  name: string
  email: string
}

export const adminEmail = process.env.ADMIN_EMAIL ?? 'qinalexander56@gmail.com'

const defaultFrom = 'Safari Adventures <bookings@safariadventures.com>'

export function getEmailFromRaw(): string {
  return process.env.EMAIL_FROM ?? defaultFrom
}

export function parseFromAddress(from = getEmailFromRaw()): ParsedFromAddress {
  const match = from.match(/^(.+?)\s*<([^>]+)>$/)
  if (match) {
    return { name: match[1].trim(), email: match[2].trim() }
  }
  return { name: 'Safari Adventures', email: from.trim() }
}

export function isMailjetConfigured(): boolean {
  return Boolean(process.env.MAILJET_API_KEY && process.env.MAILJET_SECRET_KEY)
}

export function isGmailConfigured(): boolean {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD)
}

export function isEmailConfigured(): boolean {
  return isMailjetConfigured() || isGmailConfigured()
}

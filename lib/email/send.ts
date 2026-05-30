import { adminEmail, isEmailConfigured, isGmailConfigured, isMailjetConfigured } from './config'
import { sendViaGmail } from './providers/gmail'
import { sendViaMailjet } from './providers/mailjet'

type SendEmailInput = {
  to: string
  subject: string
  html: string
}

async function sendEmail({ to, subject, html }: SendEmailInput): Promise<void> {
  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV === 'development') {
      console.info('[email:dev]', { to, subject })
    }
    return
  }

  if (isMailjetConfigured()) {
    try {
      await sendViaMailjet({ to, subject, html })
      return
    } catch (error) {
      console.error('[email:mailjet]', error instanceof Error ? error.message : error)

      if (!isGmailConfigured()) {
        throw error
      }

      console.warn('[email] Falling back to Gmail SMTP')
    }
  }

  if (isGmailConfigured()) {
    await sendViaGmail({ to, subject, html })
    return
  }
}

/** Fire-and-forget — never blocks or throws on booking flows */
export function sendEmailSafe(input: SendEmailInput): void {
  sendEmail(input).catch((err) => {
    console.error('[email]', err instanceof Error ? err.message : err)
  })
}

export function sendAdminEmailSafe(input: Omit<SendEmailInput, 'to'>): void {
  sendEmailSafe({ ...input, to: adminEmail })
}

export { isEmailConfigured, isMailjetConfigured, isGmailConfigured }

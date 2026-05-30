type BookingEmailContext = {
  customerName: string
  bookingId: string
  packageTitle: string
  startDate: string
  endDate: string
  guests: number
  totalPrice: string
}

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function layout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html>
<body style="font-family:system-ui,sans-serif;line-height:1.6;color:#1a1a1a;max-width:560px;margin:0 auto;padding:24px">
  <h1 style="color:#2d5016;font-size:20px">${title}</h1>
  ${body}
  <hr style="margin:24px 0;border:none;border-top:1px solid #e5e5e5"/>
  <p style="font-size:12px;color:#666">Safari Adventures · Nairobi, Kenya · info@safariadventures.com</p>
</body>
</html>`
}

export function bookingCreatedEmail(ctx: BookingEmailContext): { subject: string; html: string } {
  return {
    subject: `Booking created — ${ctx.packageTitle}`,
    html: layout('Your safari booking is ready', `
      <p>Hi ${ctx.customerName},</p>
      <p>Thanks for booking <strong>${ctx.packageTitle}</strong>.</p>
      <ul>
        <li><strong>Reference:</strong> ${ctx.bookingId}</li>
        <li><strong>Dates:</strong> ${formatDate(ctx.startDate)} – ${formatDate(ctx.endDate)}</li>
        <li><strong>Guests:</strong> ${ctx.guests}</li>
        <li><strong>Total:</strong> KES ${ctx.totalPrice}</li>
      </ul>
      <p>Complete payment to secure your spot. Your booking status is <strong>Awaiting Payment</strong>.</p>
    `),
  }
}

export function paymentSubmittedCustomerEmail(ctx: BookingEmailContext & { transactionId?: string }): {
  subject: string
  html: string
} {
  return {
    subject: `Payment submitted — ${ctx.packageTitle}`,
    html: layout('Payment received for verification', `
      <p>Hi ${ctx.customerName},</p>
      <p>We received your payment details for <strong>${ctx.packageTitle}</strong>.</p>
      <ul>
        <li><strong>Booking:</strong> ${ctx.bookingId}</li>
        <li><strong>Amount:</strong> KES ${ctx.totalPrice}</li>
        ${ctx.transactionId ? `<li><strong>Reference:</strong> ${ctx.transactionId}</li>` : ''}
      </ul>
      <p>Our team will verify your payment shortly. You will receive another email once your booking is confirmed.</p>
    `),
  }
}

export function paymentSubmittedAdminEmail(ctx: BookingEmailContext & { transactionId?: string }): {
  subject: string
  html: string
} {
  return {
    subject: `[Action required] Payment to verify — ${ctx.bookingId.slice(0, 8)}`,
    html: layout('New payment pending verification', `
      <p>A customer submitted payment that needs admin approval.</p>
      <ul>
        <li><strong>Customer:</strong> ${ctx.customerName}</li>
        <li><strong>Booking:</strong> ${ctx.bookingId}</li>
        <li><strong>Package:</strong> ${ctx.packageTitle}</li>
        <li><strong>Amount:</strong> KES ${ctx.totalPrice}</li>
        ${ctx.transactionId ? `<li><strong>Reference:</strong> ${ctx.transactionId}</li>` : ''}
      </ul>
      <p>Review in the admin console under Payments.</p>
    `),
  }
}

export function bookingConfirmedEmail(ctx: BookingEmailContext): { subject: string; html: string } {
  return {
    subject: `Booking confirmed — ${ctx.packageTitle}`,
    html: layout('Your safari is confirmed!', `
      <p>Hi ${ctx.customerName},</p>
      <p>Great news — your payment was verified and your booking for <strong>${ctx.packageTitle}</strong> is now confirmed.</p>
      <ul>
        <li><strong>Reference:</strong> ${ctx.bookingId}</li>
        <li><strong>Dates:</strong> ${formatDate(ctx.startDate)} – ${formatDate(ctx.endDate)}</li>
        <li><strong>Guests:</strong> ${ctx.guests}</li>
      </ul>
      <p>We will share pre-trip details before your departure. Safe travels!</p>
    `),
  }
}

export function paymentFailedEmail(ctx: BookingEmailContext): { subject: string; html: string } {
  return {
    subject: `Payment not verified — ${ctx.packageTitle}`,
    html: layout('Payment could not be verified', `
      <p>Hi ${ctx.customerName},</p>
      <p>We were unable to verify your payment for booking <strong>${ctx.bookingId}</strong>.</p>
      <p>Please sign in and submit payment again, or contact us if you believe this is an error.</p>
    `),
  }
}

export function driverAssignedEmail(ctx: {
  driverName: string
  packageTitle: string
  bookingId: string
  startDate: string
  endDate: string
  guests: number
}): { subject: string; html: string } {
  return {
    subject: `New tour assignment — ${ctx.packageTitle}`,
    html: layout('You have been assigned a tour', `
      <p>Hi ${ctx.driverName},</p>
      <p>You have been assigned to lead <strong>${ctx.packageTitle}</strong>.</p>
      <ul>
        <li><strong>Booking:</strong> ${ctx.bookingId}</li>
        <li><strong>Dates:</strong> ${formatDate(ctx.startDate)} – ${formatDate(ctx.endDate)}</li>
        <li><strong>Guests:</strong> ${ctx.guests}</li>
      </ul>
      <p>Check your driver portal for full trip details.</p>
    `),
  }
}

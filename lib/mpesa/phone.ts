export function normalizeKenyanPhone(input: string): string {
  const digits = input.replace(/\D/g, '')

  if (digits.startsWith('254') && digits.length === 12) {
    return digits
  }

  if (digits.startsWith('0') && digits.length === 10) {
    return `254${digits.slice(1)}`
  }

  if (digits.length === 9 && !digits.startsWith('0')) {
    return `254${digits}`
  }

  throw new Error('Invalid Kenyan phone number. Use 07XX XXX XXX, +254..., or 254...')
}

export function formatPhoneForDisplay(phone: string): string {
  if (phone.length === 12 && phone.startsWith('254')) {
    return `+${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`
  }
  return phone
}

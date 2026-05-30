/** Daraja API timestamp in Africa/Nairobi — YYYYMMDDHHmmss */
export function getDarajaTimestamp(date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Nairobi',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date)

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? ''

  return `${get('year')}${get('month')}${get('day')}${get('hour')}${get('minute')}${get('second')}`
}

export function buildDarajaPassword(shortcode: string, passkey: string, timestamp: string): string {
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')
}

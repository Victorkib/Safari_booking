/** Date-only helpers (YYYY-MM-DD) — avoids timezone drift from Date parsing */

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export function isValidDateString(value: string): boolean {
  if (!DATE_RE.test(value)) return false
  const [y, m, d] = value.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d))
  return (
    date.getUTCFullYear() === y &&
    date.getUTCMonth() === m - 1 &&
    date.getUTCDate() === d
  )
}

/** Add calendar days to a date-only string (UTC calendar math). */
export function addDaysToDateString(dateStr: string, daysToAdd: number): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d))
  date.setUTCDate(date.getUTCDate() + daysToAdd)
  const yy = date.getUTCFullYear()
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(date.getUTCDate()).padStart(2, '0')
  return `${yy}-${mm}-${dd}`
}

/** End date for a package: start + (durationDays - 1) inclusive nights/days. */
export function computeEndDateFromStart(startDate: string, durationDays: number): string {
  return addDaysToDateString(startDate, durationDays - 1)
}

/** Local calendar today as YYYY-MM-DD (for min date on inputs). */
export function todayDateString(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function compareDateStrings(a: string, b: string): number {
  return a.localeCompare(b)
}

export function formatDateLong(
  dateStr: string,
  locale: string = 'en-KE'
): string {
  if (!isValidDateString(dateStr)) return dateStr
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export function formatDateRange(
  start: string,
  end: string,
  locale: string = 'en-KE'
): string {
  const opts: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }
  const [sy, sm, sd] = start.split('-').map(Number)
  const [ey, em, ed] = end.split('-').map(Number)
  const s = new Date(Date.UTC(sy, sm - 1, sd)).toLocaleDateString(locale, opts)
  const e = new Date(Date.UTC(ey, em - 1, ed)).toLocaleDateString(locale, opts)
  return `${s} – ${e}`
}

export function tripDayCount(start: string, end: string): number {
  const [sy, sm, sd] = start.split('-').map(Number)
  const [ey, em, ed] = end.split('-').map(Number)
  const startMs = Date.UTC(sy, sm - 1, sd)
  const endMs = Date.UTC(ey, em - 1, ed)
  return Math.round((endMs - startMs) / (1000 * 60 * 60 * 24)) + 1
}

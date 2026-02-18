export function formatCurrency(amount: number, currency = 'COP'): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function formatDateLong(date: Date): string {
  return new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatNights(checkIn: Date, checkOut: Date): number {
  return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
}

/**
 * Si checkOut es null, infiere 1 noche a partir de checkIn (check-in + 1 día a las 12:00).
 * Retorna la fecha de check-out efectiva.
 */
export function resolveCheckOut(checkIn: Date, checkOut: Date | null): Date {
  if (checkOut) return checkOut
  const next = new Date(checkIn)
  next.setDate(next.getDate() + 1)
  next.setHours(12, 0, 0, 0)
  return next
}

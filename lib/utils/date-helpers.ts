export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return 'N/A'
  const datePart = dateString.split('T')[0]
  const [year, month, day] = datePart.split('-')
  return `${day}/${month}/${year}`
}

export function parseDate(dateString: string): Date {
  return new Date(dateString)
}

export function toISOString(date: Date): string {
  return date.toISOString()
}

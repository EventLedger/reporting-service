/**
 * Extracts the month and year from a Date object.
 *
 * @param date - The date from which to extract the month and year.
 * @returns An object containing the month and year.
 */
export function getMonthYearFromDate(date: Date): {
  month: number
  year: number
} {
  const d = new Date(date)
  const month = d.getMonth() + 1
  const year = d.getFullYear()

  return { month, year }
}

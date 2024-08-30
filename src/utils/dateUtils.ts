export function getMonthYearFromDate(date: Date): {
  month: number
  year: number
} {
  const d = new Date(date)
  const month = d.getMonth() + 1
  const year = d.getFullYear()

  return { month, year }
}

export function getPreviousMonthYear(
  month: number,
  year: number,
): { month: number; year: number } {
  if (month === 1) {
    // If the current month is January, go back to December of the previous year
    return { month: 12, year: year - 1 }
  } else {
    // Otherwise, just go back one month
    return { month: month - 1, year }
  }
}

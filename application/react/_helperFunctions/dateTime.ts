/**
 * Get the day, month, and year in a formatted string from a UTC Date (Ex: '2022-02-26T16:37:48.244Z')
 *
 * @param {Date | undefined} utcDate - The UTC Date to extract the day, month, and year from. If not provided, it will return 'N/A'.
 * @returns {string} - A string containing the day, month, and year (Ex: 'November 12th, 2022').
 */
export const getDayMonthYear = (utcDate: Date | undefined): string => {
  if (!utcDate) {
    return 'N/A'
  }

  return new Date(utcDate).toLocaleString('en-US', {year: 'numeric', day: '2-digit', month: 'long', timeZone: 'UTC'});
}
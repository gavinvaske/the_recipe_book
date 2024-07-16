export const getDayMonthYear = (mongooseDateTime: Date | undefined): string => {
  if (!mongooseDateTime) {
    return 'N/A'
  }
  return new Date(mongooseDateTime).toLocaleString('en-US', {year: 'numeric', day: '2-digit', month: 'long', timeZone: 'UTC'});
}
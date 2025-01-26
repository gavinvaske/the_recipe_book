export const getDateFromIsoStr = (dateAsString: any): string => {
  if (!dateAsString || typeof dateAsString !== 'string') {
    return ''
  }
  return new Date(dateAsString).toLocaleString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
}

export const getDateTimeFromIsoStr = (dateTimeAsString: any): string => {
  if (!dateTimeAsString || typeof dateTimeAsString !== 'string') {
    return ''
  }
  return new Date(dateTimeAsString).toLocaleString('en-US', { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric' });
}
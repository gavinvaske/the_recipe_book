export const getDateFromIsoStr = (dateAsString: string | undefined): string => {
  if (!dateAsString) {
    return ''
  }
  return new Date(dateAsString).toLocaleString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
}

export const getDateTimeFromIsoStr = (dateTimeAsString: string | undefined): string => {
  if (!dateTimeAsString) {
    return ''
  }

  return new Date(dateTimeAsString).toLocaleString('en-US', { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric' });
}
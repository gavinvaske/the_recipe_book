export const getDateFromIsoStr = (dateAsString: string | undefined): string => {
  if (!dateAsString) {
    return ''
  }
  return new Date(dateAsString).toISOString().substring(0, 10)
}

export const getDateTimeFromIsoStr = (dateTimeAsString: string | undefined): string => {
  if (!dateTimeAsString) {
    return ''
  }

  return new Date(dateTimeAsString).toLocaleString()
}
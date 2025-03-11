

export const dateToTime = (date: string | Date) => {
  return new Date(date).toLocaleTimeString('en-US', { timeStyle: 'short' })
}

export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', { dateStyle: 'medium' })
}
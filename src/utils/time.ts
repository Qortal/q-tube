import moment from 'moment'

export function formatTimestamp(timestamp: number): string {
  const now = moment()
  const timestampMoment = moment(timestamp)
  const elapsedTime = now.diff(timestampMoment, 'minutes')

  if (elapsedTime < 1) {
    return 'Just now'
  } else if (elapsedTime < 60) {
    return `${elapsedTime}m`
  } else if (elapsedTime < 1440) {
    return `${Math.floor(elapsedTime / 60)}h`
  } else {
    return timestampMoment.format('MMM D')
  }
}

export function formatTimestampSeconds(timestamp: number): string {
  const now = moment()
  const timestampMoment = moment.unix(timestamp)
  const elapsedTime = now.diff(timestampMoment, 'minutes')

  if (elapsedTime < 1) {
    return 'Just now'
  } else if (elapsedTime < 60) {
    return `${elapsedTime}m`
  } else if (elapsedTime < 1440) {
    return `${Math.floor(elapsedTime / 60)}h`
  } else {
    return timestampMoment.format('MMM D')
  }
}



export const formatDate = (unixTimestamp: number): string => {
  const date = moment(unixTimestamp, 'x').fromNow()

  return date
}
export const formatDateSeconds = (unixTimestamp: number): string => {
  const date = moment.unix(unixTimestamp).fromNow();

  return date
}
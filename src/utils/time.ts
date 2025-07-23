import moment from 'moment/min/moment-with-locales';

const normalizeLocale = (lng: string) => {
  const lower = lng.toLowerCase();
  if (lower.startsWith('zh')) return 'zh-cn';
  if (lower.startsWith('en')) return 'en';
  if (lower.startsWith('pt')) return 'pt-br';
  return lower;
};

export function formatTimestamp(timestamp: number): string {
  const now = moment();
  const timestampMoment = moment(timestamp);
  const elapsedTime = now.diff(timestampMoment, 'minutes');

  if (elapsedTime < 1) {
    return 'Just now';
  } else if (elapsedTime < 60) {
    return `${elapsedTime}m`;
  } else if (elapsedTime < 1440) {
    return `${Math.floor(elapsedTime / 60)}h`;
  } else {
    return timestampMoment.format('MMM D');
  }
}

export function formatTimestampSeconds(timestamp: number): string {
  const now = moment();
  const timestampMoment = moment.unix(timestamp);
  const elapsedTime = now.diff(timestampMoment, 'minutes');

  if (elapsedTime < 1) {
    return 'Just now';
  } else if (elapsedTime < 60) {
    return `${elapsedTime}m`;
  } else if (elapsedTime < 1440) {
    return `${Math.floor(elapsedTime / 60)}h`;
  } else {
    return timestampMoment.format('MMM D');
  }
}

export const formatDate = (
  unixTimestamp: number,
  locale: string = 'en'
): string => {
  moment.locale(normalizeLocale(locale));
  return moment(unixTimestamp, 'x').fromNow();
};
export const formatDateSeconds = (unixTimestamp: number): string => {
  const date = moment.unix(unixTimestamp).fromNow();

  return date;
};

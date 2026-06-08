import dayjs from 'dayjs'

export function formatDate(date, template = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(date).format(template)
}

export function formatDateShort(date) {
  return dayjs(date).format('YYYY-MM-DD')
}

export function daysAgo(n) {
  return dayjs().subtract(n, 'day').toISOString()
}

export function isToday(date) {
  return dayjs(date).isSame(dayjs(), 'day')
}

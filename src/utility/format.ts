import moment from 'moment'

export function formatDate(dateStr: string) {
  return moment(dateStr).format('YYYY/MM/DD')
}

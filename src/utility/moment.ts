import moment from 'moment'
export function DisabledMoment(type: string, current: any) {
  switch (type) {
    case 'isAfterToday':
      return current < moment().endOf('day')
    case 'isStartFromToday':
      return current < moment().subtract(1, 'day').endOf('day')
    default:
      return false
  }
}

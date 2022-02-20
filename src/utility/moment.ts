import moment from 'moment'
export function DisabledMoment(type: string, current: any) {
  switch (type) {
    case 'isAfterToday':
      return current < moment().endOf('day')
    default:
      return false
  }
}

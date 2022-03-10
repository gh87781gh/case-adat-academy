import {
  IconPathEmpty,
  IconPathInProgress,
  IconPathCheck,
  IconPathHover,
  IconPathLine,
  IconPathArrow
} from 'utility/icon'

interface IProps {
  type: string
  available: boolean
  status: string
  last_read_day?: number
}

const FormatCourseStatus = (props: IProps) => {
  if (props.type === 'ICON') {
    if (props.available) {
      switch (props.status) {
        case 'Not started yet':
          return <IconPathEmpty />
        case 'In progress':
          return <IconPathInProgress />
        case 'All read':
          return <IconPathCheck />
        default:
          return null
      }
    } else {
      return <IconPathEmpty />
    }
  } else if (props.type === 'STRING') {
    if (props.available) {
      switch (props.status) {
        case 'Not started yet':
        case 'All read':
          return (
            <span style={{ textTransform: 'uppercase' }}>{props.status}</span>
          )
        case 'In progress':
          return (
            <>
              <span style={{ textTransform: 'uppercase' }}>
                {props.last_read_day} DAYS AGO
              </span>{' '}
              LAST READ
            </>
          )
        default:
          return null
      }
    } else {
      return <>NOT AVAILABLE</>
    }
  }
  return null

  // else if (type === 'STRING') {
  //   switch (status) {
  //     case 'Not started yet':
  //       return <IconPathEmpty />
  //     case 'In progress':
  //       return <IconPathInProgress />
  //     case 'All read':
  //       return <IconPathCheck />
  //     default:
  //       return null
  //   }
  // }
}
export default FormatCourseStatus

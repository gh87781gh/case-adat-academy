import { Button } from 'antd'

interface IProps {
  type?: string
  children?: any
  props?: any
}

const Btn = (props: IProps) => {
  switch (props.type) {
    case 'primary':
      return (
        <Button className='ad-btn-primary' {...props.props}>
          {props.children}
        </Button>
      )
    case 'action':
      return (
        <Button className='ad-btn-action' type='primary' {...props.props}>
          {props.children}
        </Button>
      )
    case 'bordless':
      return (
        <Button className='ad-btn-bordless' type='text' {...props.props}>
          {props.children}
        </Button>
      )
    case 'link':
      return (
        <Button className='ad-btn-link' type='link' {...props.props}>
          {props.children}
        </Button>
      )
    default:
      return <Button type='dashed'>{props.children}</Button>
  }
}
export default Btn

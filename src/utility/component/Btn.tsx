import { Button } from 'antd'

const Btn = (props: any) => {
  switch (props.feature) {
    case 'action':
      return (
        <Button type='primary' {...props}>
          {props.children}
        </Button>
      )
    case 'primary':
      return <Button {...props}>{props.children}</Button>
    case 'secondary':
      return (
        <Button type='text' {...props}>
          {props.children}
        </Button>
      )
    case 'link':
      return (
        <Button type='link' {...props}>
          {props.children}
        </Button>
      )
    default:
      return <Button type='dashed'>{props.children}</Button>
  }
}
export default Btn

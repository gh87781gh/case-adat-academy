import { IconDanger } from 'utility/icon'

interface IProps {
  type?: string
  withIcon?: boolean
  isShow: boolean
  msg: string
}

const FormGroupMsg = (props: IProps) => {
  const icon = () => (props.type === 'error' ? <IconDanger /> : null)
  return (
    <>
      {props.isShow ? (
        <span className={`ad-form-group-msg ${props.type}`}>
          {props.withIcon ? icon() : null} {props.msg}
        </span>
      ) : null}
    </>
  )
}
export default FormGroupMsg

import { IconInfor } from 'utility/icon'

interface IProps {
  type?: string
  isShowIcon?: boolean
  isShow: boolean
  msg: string
}

const FormGroupMsg = (props: IProps) => {
  const icon = () => (props.type === 'error' ? <IconInfor /> : null)
  return (
    <>
      {props.isShow ? (
        <span className={`ad-form-group-msg ${props.type}`}>
          {props.isShowIcon ? icon() : null} {props.msg}
        </span>
      ) : null}
    </>
  )
}
export default FormGroupMsg

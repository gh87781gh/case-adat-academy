import { IconInfor, IconSuccessfully } from 'utility/icon'

interface IProps {
  type: string
  text: string
}

const LoginPrompt = (props: IProps) => {
  return (
    <div
      className={`ad-login-prompt ${props.type} ${
        props.text ? 'show' : 'hide'
      }`}
    >
      {props.type === 'success' ? (
        <IconSuccessfully />
      ) : props.type === 'success' ? (
        <IconInfor />
      ) : null}
      {props.text}&nbsp;
    </div>
  )
}
export default LoginPrompt

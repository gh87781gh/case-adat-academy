import { IconInfor } from 'utility/icon'

interface IProps {
  text: string
}

const LoginPrompt = (props: IProps) => {
  return (
    <div className={`ad-login-content-err ${props.text ? 'show' : 'hide'}`}>
      <IconInfor />
      {props.text}&nbsp;
    </div>
  )
}
export default LoginPrompt

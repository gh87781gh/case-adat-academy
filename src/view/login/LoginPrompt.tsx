import { IconInfor, IconSuccessfully } from 'utility/icon'

interface IProps {
  type?: string
  text: string
}

/**
 * Login 模組專用原地提示，text 有值才會顯現，預設為隱藏
 * @param type error/success，預設為 error
 * @param text 提示文字
 *
 */
const LoginPrompt = (props: IProps) => {
  return (
    <div
      className={`aa-login-prompt ${props.type || 'error'} ${
        props.text ? 'show' : 'hide'
      }`}
    >
      {props.type === 'success' ? (
        <IconSuccessfully />
      ) : props.type === 'error' ? (
        <IconInfor />
      ) : null}
      {props.text}&nbsp;
    </div>
  )
}
export default LoginPrompt

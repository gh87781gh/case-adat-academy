interface IProps {
  type?: string
  isShow: boolean
  msg: string
}

const FormGroupMsg = (props: IProps) => {
  return (
    <>
      {props.isShow ? (
        <span className={`ad-form-group-msg ${props.type}`}>{props.msg}</span>
      ) : null}
    </>
  )
}
export default FormGroupMsg

import LoginTemplate from 'view/login/LoginTemplate'

const SignUpConfirm = () => {
  return (
    <LoginTemplate>
      <h1 className='aa-login-content-header'>Confirmation needed</h1>
      <div className='aa-login-content-body'>
        <p>
          Thank you for the sign up! Pease check your email box & click the
          confirmation link.
        </p>
      </div>
    </LoginTemplate>
  )
}
export default SignUpConfirm

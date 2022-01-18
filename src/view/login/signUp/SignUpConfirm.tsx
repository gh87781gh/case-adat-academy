import LoginTemplate from 'view/login/LoginTemplate'

const SignUpConfirm = () => {
  return (
    <LoginTemplate>
      <div className='ad-login-content-header'>Confirmation needed</div>
      <div className='ad-login-content-body'>
        <p>
          Thank you for the sign up! Pease check your email box & click the
          confirmation link.
        </p>
      </div>
    </LoginTemplate>
  )
}
export default SignUpConfirm

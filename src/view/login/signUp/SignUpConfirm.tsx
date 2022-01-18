import { useHistory } from 'react-router-dom'
import LoginTemplate from 'view/login/LoginTemplate'
import { Btn } from 'utility/component'

const SignUpConfirm = () => {
  const history = useHistory()

  return (
    <LoginTemplate>
      <div className='ad-login-content-header'>
        <h1>Confirmation needed</h1>
      </div>
      <div className='ad-login-content-body'>
        <p>
          Thank you for the sign up! Pease check your email box & click the
          confirmation link.{' '}
        </p>
      </div>
      <div className='ad-login-content-footer'>
        <Btn feature='action' onClick={() => history.push('/login')}>
          Continue
        </Btn>
      </div>
    </LoginTemplate>
  )
}
export default SignUpConfirm

import { useHistory } from 'react-router-dom'

import LoginTemplate from 'view/login/LoginTemplate'

import { Btn } from 'utility/component'

const PasswordRecover2 = () => {
  const history = useHistory()

  return (
    <LoginTemplate>
      <div className='ad-login-content-header'>Recover password</div>
      <div className='ad-login-content-body'>
        <p>
          If account exists, an email will be sent with further instructions
        </p>
        <Btn feature='link' onClick={() => history.push('/login/contact')}>
          Invaild email? Contact us.
        </Btn>
      </div>
      <div className='ad-login-content-footer'>
        <Btn
          feature='action'
          className='ad-login-content-actionBtn'
          block
          onClick={() => history.push('/login')}
        >
          Continue
        </Btn>
      </div>
    </LoginTemplate>
  )
}
export default PasswordRecover2

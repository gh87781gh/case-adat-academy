import { useHistory } from 'react-router-dom'

import LoginTemplate from 'view/login/LoginTemplate'

import { Btn } from 'utility/component'

const PasswordRecover2 = () => {
  const history = useHistory()

  return (
    <LoginTemplate>
      <h1 className='aa-login-content-header'>Recover password</h1>
      <div className='aa-login-content-body'>
        <p>
          If account exists, an email will be sent with further instructions
        </p>
        <Btn feature='link' onClick={() => history.push('/login/contact')}>
          Invaild email? Contact us.
        </Btn>
      </div>
      <div className='aa-login-content-footer'>
        <Btn
          feature='action'
          className='aa-login-content-actionBtn'
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

import { useHistory } from 'react-router-dom'

import LoginTemplate from 'view/login/LoginTemplate'

import { Btn } from 'utility/component'

const ContactConfirm = () => {
  const history = useHistory()

  return (
    <LoginTemplate>
      <div className='ad-login-content-header'>Successfully submitted!</div>
      <div className='ad-login-content-body'>
        <p>Thank you! We will try to reach you within 2 working days.</p>
      </div>
      <div className='ad-login-content-footer'>
        <Btn
          feature='primary'
          className='ad-login-content-actionBtn'
          block
          onClick={() => history.push('/login')}
        >
          Go to log in
        </Btn>
      </div>
    </LoginTemplate>
  )
}
export default ContactConfirm

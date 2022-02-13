import { useHistory, useParams } from 'react-router-dom'

import LoginTemplate from 'view/login/LoginTemplate'

import { Btn } from 'utility/component'

const Successfully = () => {
  const history = useHistory()
  const { type } = useParams<{ type: string }>()

  return (
    <LoginTemplate>
      <div className='ad-login-content-header'>Confirmation needed.</div>
      <div className='ad-login-content-body'>
        {type === 'afterUpdateEmail' ? (
          <p>
            We notice you’ve updated the email. Please check your email box &
            click the confirmation link. Thank you!
          </p>
        ) : null}
      </div>
      <div className='ad-login-content-footer'>
        <Btn
          feature='link'
          className='ad-login-content-actionBtn'
          onClick={() => history.push('/login/contact')}
        >
          Invalid email? Contact us.
        </Btn>
      </div>
    </LoginTemplate>
  )
}
export default Successfully

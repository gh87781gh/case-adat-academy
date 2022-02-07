import { useHistory, useParams } from 'react-router-dom'

import LoginTemplate from 'view/login/LoginTemplate'

import { Btn } from 'utility/component'

const Successfully = () => {
  const history = useHistory()
  const { type } = useParams<{ type: string }>()

  return (
    <LoginTemplate>
      <div className='ad-login-content-header'>
        Successfully{' '}
        {type === 'submitted'
          ? 'submitted!'
          : type === 'submitted'
          ? 'updated'
          : type === 'loggedOut'
          ? 'logged out'
          : ''}
        !
      </div>
      <div className='ad-login-content-body'>
        {type === 'submitted' ? (
          <p>'Thank you! We will try to reach you within 2 working days.'</p>
        ) : null}
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
export default Successfully

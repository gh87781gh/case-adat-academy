import { useState } from 'react'
import { useHistory } from 'react-router-dom'

import LoginTemplate from 'view/login/LoginTemplate'
import LoginPrompt from '../LoginPrompt'

import { IconCopy } from 'utility/icon'
import { Btn } from 'utility/component'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Input } from 'antd'

const PasswordRecover3 = () => {
  const history = useHistory()

  const [tempPassword, setTempPassword] = useState<string>('123456')
  const [isCopy, setIsCopy] = useState<boolean>(false)

  return (
    <LoginTemplate>
      <LoginPrompt type='success' text={isCopy ? 'Copied' : ''} />
      <div className='ad-login-content-header'>Recover password</div>
      <div className='ad-login-content-body'>
        <p>Your temporary password for ????? is</p>
        {/* <p>Your temporary password for {data.account} is</p> */}
        <div className='ad-form-group'>
          <label className='required'>User ID</label>

          <CopyToClipboard
            text={tempPassword}
            onCopy={() => {
              setIsCopy(true)
              setTimeout(() => {
                setIsCopy(false)
              }, 3000)
            }}
          >
            <Input
              className='ad-input-copy'
              value={tempPassword}
              suffix={<IconCopy />}
            />
          </CopyToClipboard>
        </div>
        <p>
          Please copy the password and log in, after which you will be asked to
          change password.
        </p>
      </div>
      <div className='ad-login-content-footer'>
        <Btn
          feature='action'
          className='ad-login-content-actionBtn'
          block
          onClick={() => history.push('/login')}
        >
          Go to Log in
        </Btn>
      </div>
    </LoginTemplate>
  )
}
export default PasswordRecover3

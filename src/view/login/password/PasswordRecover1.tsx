import { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { MyContext } from 'storage'
import LoginApi from 'api/LoginApi'

import LoginTemplate from 'view/login/LoginTemplate'

import { ValidateStr } from 'utility/validate'
import { Btn, FormGroupMsg } from 'utility/component'
import { IconArrowPrev } from 'utility/icon'
import { Input } from 'antd'

interface IState {
  account: string
}

const PasswordRecover1 = () => {
  const history = useHistory()
  const context = useContext(MyContext)
  const api = new LoginApi()

  const [isEmail, setIsEmail] = useState<boolean | undefined>(undefined)
  const [data, setData] = useState<IState>({
    account: ''
  })
  const onChange = (key: string, e: any) => {
    let value = e.target.value
    if (value) {
      switch (key) {
        case 'account':
          // if (value && !ValidateStr('isUserName', value)) return false
          // value = value.toLowerCase()
          setIsEmail(
            value.match('@') ? ValidateStr('isEmail', value) : undefined
          )
          break
      }
    }
    setData({ ...data, [key]: value })
  }
  const recoverPassword = () => {
    context.setIsLoading(true)
    api.recoverPassword(data).finally(() => {
      context.setIsLoading(false)
      history.push('/login/passwordRecover2')
    })
  }

  return (
    <LoginTemplate>
      <Btn
        style={{ marginBottom: '16px' }}
        feature='secondary'
        onClick={() => history.push('/login')}
      >
        <IconArrowPrev />
        Back
      </Btn>
      <h1 className='aa-login-content-header'>Recover password</h1>
      <div className='aa-login-content-body'>
        <p>Don’t worry, happens to the best of us.</p>
        <div className='aa-form-group'>
          <label>User ID or Email</label>
          <Input
            placeholder='Clear hint for the input'
            maxLength={200}
            value={data.account}
            onChange={(e) => onChange('account', e)}
          />
          <FormGroupMsg
            isShow={isEmail === false}
            type='error'
            isShowIcon={true}
            msg='The Email format is not correct.'
          />
        </div>
        <Btn feature='link' onClick={() => history.push('/login/contact')}>
          Forgot user ID or Email? Contact us
        </Btn>
      </div>
      <div className='aa-login-content-footer'>
        <Btn
          feature='action'
          disabled={!data.account || isEmail === false}
          className='aa-login-content-actionBtn'
          block
          onClick={() => recoverPassword()}
        >
          Email me a recovery link
        </Btn>
      </div>
    </LoginTemplate>
  )
}
export default PasswordRecover1

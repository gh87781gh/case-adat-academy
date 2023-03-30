import { useState, useContext, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { MyContext, BrowserStorage, StaticService } from 'storage'
import LoginApi from 'api/LoginApi'

import LoginTemplate from 'view/login/LoginTemplate'

import schema from 'utility/validate'
import { Btn, FormGroupMsg } from 'utility/component'
import { Input, message } from 'antd'

interface IState {
  password: string
  password2: string
}

const PasswordRecover3 = () => {
  const context = useContext(MyContext)
  const browserStorage = new BrowserStorage()
  const api = new LoginApi()
  const history = useHistory()
  const location = useLocation()
  const { state }: any = location

  // data
  const [data, setData] = useState<IState>({
    password: '',
    password2: ''
  })
  const onChange = (key: string, e: any) => {
    let value = e.target.value
    if (value) {
      switch (key) {
        case 'password':
        case 'password2':
          if (schema.password.validateStr(value)) return false
          break
      }
    }
    setData({ ...data, [key]: value })
  }

  // api
  const loginWithNewPassword = () => {
    context.setIsLoading(true)
    const sendData = {
      key: state.key,
      password: data.password
    }
    api
      .changePassword(sendData)
      .then((res: any) => {
        browserStorage.setStorage('AUTH', res.data.token)
        context.getAuth()
        message.success(StaticService.msgFrontend.loginSuccessfully)
        history.push('/course')
      })
      .catch((err: any) => {
        // console.log('err', err)
      })
      .finally(() => context.setIsLoading(false))
  }

  useEffect(() => {
    if (!state) history.push('/login')
  }, [state]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <LoginTemplate>
      <h1 className='aa-login-content-header'>Change password</h1>
      <div className='aa-login-content-body'>
        <p>Please enter your new password</p>
        <div className='aa-form-group'>
          <label>New password</label>
          <Input.Password
            placeholder='Clear hint for the input'
            maxLength={100}
            value={data.password}
            onChange={(e) => onChange('password', e)}
          />
          <FormGroupMsg
            isShow={true}
            type='info'
            msg='At least 8 characters. A mixture of letters and numbers.'
          />
        </div>
        <div className='aa-form-group'>
          <label>New password again</label>
          <Input.Password
            placeholder='Clear hint for the input'
            maxLength={100}
            value={data.password2}
            onChange={(e) => onChange('password2', e)}
          />
          <FormGroupMsg
            isShow={true}
            type='info'
            msg='Please confirm by typing password again.'
          />
          <FormGroupMsg
            isShow={
              data.password &&
              data.password2 &&
              data.password !== data.password2
            }
            type='info'
            msg='Please confirm by typing password again.'
          />
        </div>
      </div>
      <div className='aa-login-content-footer'>
        <Btn
          disabled={
            data.password && data.password2 && data.password !== data.password2
          }
          feature='action'
          className='aa-login-content-actionBtn'
          block
          onClick={() => {
            if (state) loginWithNewPassword()
          }}
        >
          Log in
        </Btn>
      </div>
    </LoginTemplate>
  )
}
export default PasswordRecover3

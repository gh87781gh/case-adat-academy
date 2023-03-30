import { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { MyContext, BrowserStorage, StaticService } from 'storage'
import LoginApi from 'api/LoginApi'

import LoginTemplate from '../LoginTemplate'
import LoginPrompt from '../LoginPrompt'

import { Btn, FormGroupMsg } from 'utility/component'
import schema from 'utility/validate'
import { IconArrowNext } from 'utility/icon'
import { Checkbox, Input, message } from 'antd'

interface IState {
  account: string
  password: string
}

const Login = () => {
  const context = useContext(MyContext)
  const api = new LoginApi()
  const browserStorage = new BrowserStorage()
  const history = useHistory()

  // data
  const [data, setData] = useState<IState>({
    account: '', // account = user_id/email
    password: ''
  })
  const [isEmail, setIsEmail] = useState<boolean | null>(null)
  const onChange = (key: string, e: any) => {
    let value = e.target.value
    if (value) {
      switch (key) {
        case 'account':
          // 這裡可輸入 user_id 或 email，所以使用 email 的 validateStr
          if (schema.email.validateStr(value)) return false
          setIsEmail(
            value.match('@') ? schema.email.validateFormat(value) : null
          )
          break
        case 'password':
          if (schema.password.validateStr(value)) return false
          break
      }
    }
    setData({ ...data, [key]: value })
  }
  useEffect(() => {
    setErrMsg('')
  }, [data])

  // remember login account
  const [isKeep, setIsKeep] = useState<boolean>(false)
  useEffect(() => {
    const keepUsername = browserStorage.getStorage('LOGIN_USERNAME')
    if (keepUsername) {
      setIsKeep(true)
      setData({ ...data, account: keepUsername })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // api
  const [errMsg, setErrMsg] = useState<string>('')
  const login = () => {
    isKeep
      ? browserStorage.setStorage('LOGIN_USERNAME', data.account)
      : browserStorage.removeStorage('LOGIN_USERNAME')

    context.setIsLoading(true)
    api
      .login(data)
      .then((res: any) => {
        browserStorage.setStorage('AUTH', res.data.token)
        context.getAuth()
        message.success(StaticService.msgFrontend.loginSuccessfully)
        history.push('/course')
      })
      .catch((err: any) => {
        // console.log(err)
        /* 
          1. 帳號或密碼錯誤，直接報錯 
            101 欄位驗證錯誤
            202 使用者不存在
            200 密碼錯誤  (訊息會顯示帳號或密碼錯誤 以防有心人try)
            203 使用者未啟用 (以後有停用帳戶的保留功能)
          2. 沒有去email點驗證，需轉址 → Login successfully after without email confirmation
            207 使用者email未驗證
        */
        switch (err.code) {
          case 100:
          case 200:
          case 202:
          case 203:
            return setErrMsg('Your user ID or password is incorrect.')
          case 207:
            history.push('/login/loginConfirm/afterUpdateEmail') //TODO
        }
        // if (err.status === '400 Bad Request')
        //   setErrMsg('Your user ID or password is incorrect.')
      })
      .finally(() => context.setIsLoading(false))
  }

  return (
    <LoginTemplate>
      <LoginPrompt text={errMsg} />
      <h1 className='aa-login-content-header'>
        LOG IN
        <Btn
          feature='secondary'
          className='aa-float-right'
          onClick={() => history.push('/login/signUp1')}
        >
          Sign up <IconArrowNext />
        </Btn>
      </h1>
      <div className='aa-login-content-body'>
        <div className='aa-form-group'>
          <label>User ID or Email</label>
          <Input
            placeholder={StaticService.placeholder.input}
            maxLength={schema.email.max}
            value={data.account}
            onChange={(e: any) => onChange('account', e)}
          />
          <FormGroupMsg
            isShow={isEmail === false}
            type='error'
            msg={schema.email.errFormat}
          />
        </div>
        <div className='aa-form-group'>
          <label>Password</label>
          <Input.Password
            placeholder={StaticService.placeholder.password}
            minLength={schema.password.min}
            maxLength={schema.password.max}
            value={data.password}
            onChange={(e: any) => onChange('password', e)}
            onPressEnter={() => {
              if (data.account && data.password && !isEmail) login()
            }}
          />
        </div>
        <Btn
          feature='link'
          onClick={() => history.push('/login/passwordRecover1')}
        >
          Forgot password ?
        </Btn>
      </div>
      <div className='aa-login-content-footer'>
        <Checkbox
          checked={isKeep}
          onChange={(e) => setIsKeep(e.target.checked)}
        >
          Remember my user ID
        </Checkbox>
        <Btn
          feature='action'
          disabled={!data.account || !data.password || isEmail === false}
          block
          onClick={() => login()}
        >
          Log in
        </Btn>
      </div>
      <div className='aa-login-container-outside-note'>
        For the best learning experience, we suggest to use the latest version
        of Google Chrome.
      </div>
    </LoginTemplate>
  )
}
export default Login

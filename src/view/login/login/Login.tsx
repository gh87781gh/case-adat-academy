import { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { MyContext, BrowserStorage } from 'storage'
import LoginApi from 'api/LoginApi'

import LoginTemplate from '../LoginTemplate'
import LoginPrompt from '../LoginPrompt'

import FormGroupMsg from 'utility/component/FormGroupMsg'
import { Btn } from 'utility/component'
import { ValidateStr } from 'utility/validate'
import { IconArrowNext } from 'utility/icon'
import { Input, Checkbox } from 'antd'

interface IState {
  account: string
  password: string
}

const Login = () => {
  const context = useContext(MyContext)
  const api = new LoginApi()
  const browserStorage = new BrowserStorage()
  const history = useHistory()

  const [data, setData] = useState<IState>({
    account: '',
    password: ''
  })
  const [isEmail, setIsEmail] = useState<boolean | undefined>(undefined)
  const onChange = (key: string, e: any) => {
    let value = e.target.value
    if (value) {
      switch (key) {
        case 'account':
          if (value && !ValidateStr('isUserName', value)) return false
          setIsEmail(
            value.match('@') ? ValidateStr('isEmail', value) : undefined
          )
          value = value.toLowerCase()
          break
        case 'password':
          if (value && !ValidateStr('isEngInt', value)) return false
          break
      }
    }
    setData({ ...data, [key]: value })
  }
  useEffect(() => {
    setErrMsg('')
  }, [data])

  const [isKeep, setIsKeep] = useState<boolean>(false)
  useEffect(() => {
    browserStorage.removeStorage('AUTH')

    const keepUsername = browserStorage.getStorage('LOGIN_USERNAME')
    if (keepUsername) {
      setIsKeep(true)
      setData({ ...data, account: keepUsername })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
        history.push('/course')
      })
      .catch((err: any) => {
        if (err.status === '400 Bad Request')
          setErrMsg('Your user ID or password is incorrect.')
      })
      .finally(() => context.setIsLoading(false))
  }

  return (
    <LoginTemplate>
      <LoginPrompt text={errMsg} />
      <div className='ad-login-content-header'>
        LOG IN
        <Btn
          feature='secondary'
          className='ad-float-right'
          onClick={() => history.push('/login/signUp1')}
        >
          Sign up <IconArrowNext />
        </Btn>
      </div>
      <div className='ad-login-content-body'>
        <div className='ad-form-group'>
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
            msg='The Email format is not correct.'
          />
        </div>
        <div className='ad-form-group'>
          <label>Password</label>
          <Input.Password
            placeholder='Clear hint for the input'
            maxLength={16}
            value={data.password}
            onChange={(e) => onChange('password', e)}
          />
          <Btn feature='link' onClick={() => history.push('/login/recover')}>
            Forgot password ?
          </Btn>
        </div>
      </div>
      <div className='ad-login-content-footer'>
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
    </LoginTemplate>
  )
}
export default Login

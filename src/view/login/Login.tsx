import { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { MyContext, BrowserStorage } from '../../storage'
import LoginApi from '../../api/LoginApi'
import FormGroupMsg from '../../utility/component/FormGroupMsg'
import { ValidateStr } from '../../utility/validate'
import { Button, Input, Checkbox } from 'antd'
import LoginTemplate from './LoginTemplate'

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
  const [loginErr, setLoginErr] = useState<string>('')
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

  const [isKeep, setIsKeep] = useState<boolean>(false)
  useEffect(() => {
    browserStorage.removeStorage('AUTH')

    const keepUsername = browserStorage.getStorage('LOGIN_USERNAME')
    if (keepUsername) {
      setIsKeep(true)
      setData({ ...data, account: keepUsername })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
      .catch((err: any) => setLoginErr(err ?? ''))
      .finally(() => context.setIsLoading(false))
  }

  const [step, setStep] = useState<number>(0)
  const renderLogin = () => (
    <>
      <div className='ad-login-content-header'>
        <h2 style={{ visibility: loginErr ? 'unset' : 'hidden' }}>
          {loginErr} &nbsp;
        </h2>
        <h1>
          LOG IN
          <Button
            className='ad-float-right'
            onClick={() => history.push('/create')}
          >
            Sign up
          </Button>
        </h1>
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
          <FormGroupMsg
            isShow={data.password.length > 0 && data.password.length < 8}
            type='error'
            msg='Password is too short'
          />
        </div>
      </div>
      <div className='ad-login-content-footer'>
        <Checkbox
          checked={isKeep}
          onChange={(e) => setIsKeep(e.target.checked)}
        >
          Remember my user ID
        </Checkbox>
        <Button
          disabled={
            !data.account ||
            !data.password ||
            data.password.length < 8 ||
            isEmail === false
          }
          type='primary'
          block
          onClick={() => login()}
        >
          Log in
        </Button>
        <Button type='link' onClick={() => history.push('/login/recover')}>
          Forgot password ?
        </Button>
      </div>
    </>
  )
  const renderLoginSuccessfully = () => (
    <>
      <div className='ad-login-content-header'>
        <h1>Successfully login!</h1>
      </div>
      <div className='ad-login-content-body'>
        <p>We’ve send a confirmation letter to your mailbox...</p>
      </div>
      <div className='ad-login-content-footer'>
        <Button
          className='ad-login-content-actionBtn'
          type='primary'
          block
          onClick={() => setStep(0)}
        >
          Continue
        </Button>
      </div>
    </>
  )
  return (
    <LoginTemplate>
      {step === 0
        ? renderLogin()
        : step === 1
        ? renderLoginSuccessfully()
        : null}
    </LoginTemplate>
  )
  return
}
export default Login

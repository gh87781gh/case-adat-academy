import { useState, useContext, useEffect } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { MyContext, BrowserStorage } from '../../../storage/storage'
import LoginApi from '../../../api/LoginApi'
import FormGroupMsg from '../../../component/FormGroupMsg'
import { ValidateStr, Validation } from '../../../utility/validate'
import { Button, Input, Checkbox } from 'antd'

interface IState {
  account: string
  password: string
}

const LoginEntry = () => {
  const context = useContext(MyContext)
  const api = new LoginApi()
  const browserStorage = new BrowserStorage()
  const history = useHistory()
  let { path } = useRouteMatch()

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
    if (data.account) {
      setIsEmail(
        data.account.match('@')
          ? ValidateStr('isEmail', data.account)
          : undefined
      )
    }
  }, [data.account])

  const [isKeep, setIsKeep] = useState<boolean>(false)
  useEffect(() => {
    const keepUsername = browserStorage.getLoginUsername()
    if (keepUsername) {
      setIsKeep(true)
      setData({ ...data, account: keepUsername })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const login = () => {
    context.setIsLoading(true)

    isKeep
      ? browserStorage.setLoginUsername(data.account)
      : browserStorage.removeLoginUsername()

    api
      .login(data)
      .then((res: any) => {
        // TODO 判斷為 admin 或 user
        setLoginErr('')
      })
      .catch((err: any) => {
        setLoginErr(err || '')
      })
      .finally(() => {
        context.setIsLoading(false)
      })
  }

  return (
    <div className='ad-login-content'>
      <h2 style={{ visibility: loginErr ? 'unset' : 'hidden' }}>{loginErr}</h2>
      <h1>
        Log in account
        <Button
          className='ad-float-right'
          onClick={() => history.push(`${path}/Create`)}
        >
          Create account
        </Button>
      </h1>
      <div>
        <div className='ad-form-group'>
          <label>User ID or Email</label>
          <Input
            placeholder={Validation.input_placeholder}
            maxLength={Validation.input_email_max}
            value={data.account}
            onChange={(e) => onChange('account', e)}
          />
          <FormGroupMsg
            isShow={isEmail === false}
            type='error'
            msg={Validation.errMsg_email_format_wrong}
          />
        </div>
        <div className='ad-form-group'>
          <label>Password</label>
          <Input.Password
            placeholder={Validation.input_placeholder}
            maxLength={Validation.input_password_max}
            value={data.password}
            onChange={(e) => onChange('password', e)}
            onPressEnter={() => login()}
          />
          <FormGroupMsg
            isShow={
              data.password.length > 0 &&
              data.password.length < Validation.input_password_min
            }
            type='error'
            msg={Validation.errMsg_password_tooShort}
          />
        </div>
      </div>
      <div>
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
            //TODO data.password.length < Validation.input_password_min ||
            isEmail === false
          }
          type='primary'
          block
          onClick={() => login()}
        >
          Log in
        </Button>
      </div>
      <Button type='link' onClick={() => history.push(`${path}/Recover`)}>
        Forgot password ?
      </Button>
    </div>
  )
}
export default LoginEntry

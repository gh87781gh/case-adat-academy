import { useState, useContext, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { MyContext, BrowserStorage } from 'storage'
import LoginApi from 'api/LoginApi'

import LoginTemplate from 'view/login/LoginTemplate'

import { Btn, FormGroupMsg } from 'utility/component'
import { Input, Checkbox } from 'antd'

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

  const [data, setData] = useState<IState>({
    password: '',
    password2: ''
  })
  const onChange = (key: string, e: any) => {
    let value = e.target.value
    if (value) {
      // switch (key) {
      //   case 'account':
      //     // if (value && !ValidateStr('isUserName', value)) return false
      //     setIsEmail(
      //       value.match('@') ? ValidateStr('isEmail', value) : undefined
      //     )
      //     // value = value.toLowerCase()
      //     break
      //     // case 'password':
      //     //   if (value && !ValidateStr('isEngInt', value)) return false
      //     break
      // }
    }
    setData({ ...data, [key]: value })
  }

  const loginWithNewPassword = () => {
    context.setIsLoading(true)
    if (state)
      api
        .recoverPasswordVerify(state.tempPassword)
        .then((res: any) => {
          const sendData = {
            account: res.data.key, //TOCHECK
            password: data.password
          }
          api
            .login(sendData)
            .then((res: any) => {
              browserStorage.setStorage('AUTH', res.data.token)
              context.getAuth()
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
              // switch (err.code) {
              //   case 100:
              //   case 200:
              //   case 202:
              //   case 203:
              //   // return setErrMsg('Your user ID or password is incorrect.')
              //   case 207:
              //     history.push('/login/loginConfirm/afterUpdateEmail') //TODO
              // }
              // if (err.status === '400 Bad Request')
              //   setErrMsg('Your user ID or password is incorrect.')
            })
            .finally(() => context.setIsLoading(false))
        })
        .finally(() => context.setIsLoading(false))
  }

  useEffect(() => {
    if (!state) history.push('/login')
  }, [state])

  return (
    <LoginTemplate>
      <div className='ad-login-content-header'>Change password</div>
      <div className='ad-login-content-body'>
        <p>Please enter your new password</p>
        <div className='ad-form-group'>
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
        <div className='ad-form-group'>
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
      <div className='ad-login-content-footer'>
        <Btn
          disabled={
            data.password && data.password2 && data.password !== data.password2
          }
          feature='action'
          className='ad-login-content-actionBtn'
          block
          onClick={() => loginWithNewPassword()}
        >
          Log in
        </Btn>
      </div>
    </LoginTemplate>
  )
}
export default PasswordRecover3

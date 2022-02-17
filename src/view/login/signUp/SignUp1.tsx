import { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { MyContext, StaticService } from 'storage'
import LoginApi from 'api/LoginApi'
import msg from 'api/engine/msg'

import LoginTemplate from 'view/login/LoginTemplate'
import LoginPrompt from '../LoginPrompt'

import schema from 'utility/validate'
import { Btn, FormGroupMsg } from 'utility/component'
import { IconArrowNext } from 'utility/icon'
import { Input } from 'antd'

interface IState {
  user_id: string
  password: string
  password2: string
  email: string
}

const SignUp1 = () => {
  const context = useContext(MyContext)
  const api = new LoginApi()
  const history = useHistory()

  // data
  const [data, setData] = useState<IState>({
    user_id: '',
    password: '',
    password2: '',
    email: ''
  })
  const [isEmail, setIsEmail] = useState<boolean | undefined>(undefined)
  const onChange = (key: string, e: any) => {
    let value = e.target.value
    if (value) {
      switch (key) {
        case 'user_id':
          if (schema.user_id.validateStr(value)) return false
          break
        case 'password':
        case 'password2':
          if (schema.password.validateStr(value)) return false
          break
        case 'email':
          if (schema.email.validateStr(value)) return false
          setIsEmail(schema.email.validateFormat(value))
          break
      }
    }
    setData({ ...data, [key]: value })
  }
  useEffect(() => {
    setErrMsg('')
  }, [data])

  // api
  const [errMsg, setErrMsg] = useState<string>('')
  const checkAccount = () => {
    context.setIsLoading(true)
    api
      .checkAccount(data)
      .then((res: any) => {
        if (res.data.user_id_is_exist) {
          setErrMsg(StaticService.msgAfterAPI.signUpCheckUserId)
        } else if (res.data.email_is_exist) {
          setErrMsg(StaticService.msgAfterAPI.signUpCheckEmail)
        } else {
          history.push({
            pathname: '/login/signUp2',
            state: {
              user_id: data.user_id,
              password: data.password,
              email: data.email
            }
          })
        }
      })
      .finally(() => context.setIsLoading(false))
  }

  return (
    <LoginTemplate>
      <LoginPrompt text={errMsg} />
      <div className='ad-login-content-header'>
        SIGN UP
        <Btn
          feature='secondary'
          className='ad-float-right'
          onClick={() => history.push('/login')}
        >
          Log in <IconArrowNext />
        </Btn>
      </div>
      <div className='ad-login-content-body'>
        <div className='ad-form-group'>
          <label className='required'>User ID</label>
          <Input
            placeholder={StaticService.placeholder.input}
            maxLength={schema.user_id.max}
            value={data.user_id}
            onChange={(e: any) => onChange('user_id', e)}
          />
          <FormGroupMsg isShow={true} msg={schema.user_id.info} />
        </div>
        <div className='ad-form-group'>
          <label className='required'>Password</label>
          <Input.Password
            placeholder={StaticService.placeholder.password}
            minLength={schema.password.min}
            maxLength={schema.password.max}
            value={data.password}
            onChange={(e: any) => onChange('password', e)}
          />
          <FormGroupMsg isShow={true} msg={schema.password.info} />
          <FormGroupMsg
            isShow={data.password.length > 0 && data.password.length < 8}
            type='error'
            isShowIcon={true}
            msg={schema.password.errTooShort}
          />
        </div>
        <div className='ad-form-group'>
          <label className='required'>Password again</label>
          <Input.Password
            placeholder={StaticService.placeholder.password}
            minLength={schema.password.min}
            maxLength={schema.password.max}
            value={data.password2}
            onChange={(e: any) => onChange('password2', e)}
          />
          <FormGroupMsg isShow={true} msg={schema.password.info2} />
          <FormGroupMsg
            isShow={data.password2 && data.password !== data.password2}
            type='error'
            isShowIcon={true}
            msg={schema.password.errNotMatch}
          />
        </div>
        <div className='ad-form-group'>
          <label className='required'>Email</label>
          <Input
            placeholder={StaticService.placeholder.input}
            value={data.email}
            maxLength={schema.email.max}
            onChange={(e: any) => onChange('email', e)}
          />
          <FormGroupMsg isShow={true} msg={schema.email.info} />
          <FormGroupMsg
            isShow={isEmail === false}
            type='error'
            isShowIcon={true}
            msg={schema.email.errFormat}
          />
        </div>
      </div>
      <div className='ad-login-content-footer'>
        <Btn
          feature='action'
          disabled={
            !data.user_id ||
            !data.password ||
            data.password.length < 8 ||
            !data.password2 ||
            data.password !== data.password2 ||
            !data.email ||
            isEmail !== true
          }
          className='ad-login-content-actionBtn'
          type='primary'
          block
          onClick={() => checkAccount()}
        >
          Next
        </Btn>
      </div>
    </LoginTemplate>
  )
}
export default SignUp1

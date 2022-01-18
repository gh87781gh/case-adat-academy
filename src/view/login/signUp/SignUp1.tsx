import { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { MyContext } from 'storage'
import LoginApi from 'api/LoginApi'
import msg from 'api/engine/msg'

import LoginTemplate from 'view/login/LoginTemplate'
import LoginPrompt from '../LoginPrompt'

import { ValidateStr } from 'utility/validate'
import FormGroupMsg from 'utility/component/FormGroupMsg'
import { Btn } from 'utility/component'
import { IconArrowNext } from 'utility/icon'
import { Input } from 'antd'

interface IState {
  user_id: string
  password: string
  passwordAgain: string
  email: string
  industry: string
  profession: string
  current_company: string
  experience: string[]
  experience_level: string
}

const SignUp1 = () => {
  const context = useContext(MyContext)
  const api = new LoginApi()
  const history = useHistory()

  const [data, setData] = useState<IState>({
    user_id: '',
    password: '',
    passwordAgain: '',
    email: '',
    industry: '',
    profession: '',
    current_company: '',
    experience: [],
    experience_level: ''
  })
  const [isEmail, setIsEmail] = useState<boolean | undefined>(undefined)
  const onChange = (key: string, e: any) => {
    let value = e.target.value
    if (value) {
      switch (key) {
        case 'user_id':
          if (value && !ValidateStr('isEngInt', value)) return false
          value = value.toLowerCase()
          break
        case 'email':
          if (value && !ValidateStr('isUserName', value)) return false
          setIsEmail(ValidateStr('isEmail', value))
          break
        case 'password':
        case 'passwordAgain':
          if (value && !ValidateStr('isEngInt', value)) return false
          break
        case 'profession':
        case 'current_company':
          if (value && ValidateStr('isSymbol', value)) return false
          break
      }
    }
    setData({ ...data, [key]: value })
  }
  useEffect(() => {
    setErrMsg('')
  }, [data])

  const [errMsg, setErrMsg] = useState<string>('')
  const checkAccount = () => {
    context.setIsLoading(true)
    api
      .checkAccount(data)
      .then((res: any) => {
        if (res.is_exist) setErrMsg(msg.checkAccount)
      })
      .finally(() => context.setIsLoading(false))
  }

  return (
    <LoginTemplate>
      <LoginPrompt text={errMsg} />
      <div className='ad-login-content-header'>
        Create account
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
            placeholder='Clear hint for the input'
            maxLength={200}
            value={data.user_id}
            onChange={(e) => onChange('user_id', e)}
          />
          <FormGroupMsg
            isShow={true}
            msg='User ID is your unique identifier as a member in AIR academy'
          />
        </div>
        <div className='ad-form-group'>
          <label className='required'>Password</label>
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
        <div className='ad-form-group'>
          <label className='required'>Password again</label>
          <Input.Password
            placeholder='Clear hint for the input'
            maxLength={16}
            value={data.passwordAgain}
            onChange={(e) => onChange('passwordAgain', e)}
          />
          <FormGroupMsg
            isShow={
              data.passwordAgain && data.password !== data.passwordAgain
                ? true
                : false
            }
            type='error'
            msg='Passwords do not match.'
          />
        </div>
        <div className='ad-form-group'>
          <label className='required'>Email</label>
          <Input
            value={data.email}
            maxLength={200}
            placeholder='Clear hint for the input'
            onChange={(e) => onChange('email', e)}
          />
          <FormGroupMsg
            isShow={isEmail === false}
            type='error'
            msg='The Email format is not correct.'
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
            !data.passwordAgain ||
            !data.email ||
            data.password !== data.passwordAgain ||
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

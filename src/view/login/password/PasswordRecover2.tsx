import { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { MyContext } from 'storage'
import LoginApi from 'api/LoginApi'

import LoginTemplate from 'view/login/LoginTemplate'

import FormGroupMsg from 'utility/component/FormGroupMsg'
import { ValidateStr } from 'utility/validate'
import { Button, Input } from 'antd'

interface IState {
  username: string
  account: string
}

const PasswordRecover2 = () => {
  const history = useHistory()
  const context = useContext(MyContext)
  const api = new LoginApi()
  // const { uuid } = useParams<{ uuid: string }>()
  // console.log('uuid:', uuid)

  const [isEmail, setIsEmail] = useState<boolean | undefined>(undefined)
  const [data, setData] = useState<IState>({
    username: '',
    account: ''
  })
  const onChange = (key: string, e: any) => {
    let value = e.target.value
    if (value) {
      switch (key) {
        case 'username':
          if (value && !ValidateStr('isUserName', value)) return false
          value = value.toLowerCase()
          setIsEmail(
            value.match('@') ? ValidateStr('isEmail', value) : undefined
          )
          break
      }
    }
    setData({ ...data, [key]: value })
  }
  const recoverPassword = () => {
    // TOCHECK 這支未完成
    context.setIsLoading(true)
    api
      .recoverPassword(data)
      .then(() => {
        // setStep(1)
      })
      .catch()
      .finally(() => context.setIsLoading(false))
  }

  return (
    <LoginTemplate>
      <div className='ad-login-content-header'>
        <h1>Recover password</h1>
      </div>
      <div className='ad-login-content-body'>
        <p>
          If account exists, an email will be sent with further instructions
        </p>
        <Button type='link' onClick={() => history.push('/login/contact')}>
          Invaild email? Contact us.
        </Button>
      </div>
      <div className='ad-login-content-footer'>
        <Button
          type='primary'
          className='ad-login-content-actionBtn'
          block
          // onClick={() => setStep(2)}
          // onClick={() => history.push('/login')} //TODO
        >
          Continue
        </Button>
      </div>
    </LoginTemplate>
  )
}
export default PasswordRecover2

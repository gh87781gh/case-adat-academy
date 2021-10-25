import { useState, useContext } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { MyContext } from '../../../storage'
import FormGroupMsg from '../../../utility/component/FormGroupMsg'
import { ValidateStr } from '../../../utility/validate'
import LoginApi from '../../../api/LoginApi'
import { Button, Input } from 'antd'

interface IState {
  username: string
  account: string
}

const Recover = () => {
  const history = useHistory()
  const context = useContext(MyContext)
  const api = new LoginApi()
  const { uuid } = useParams<{ uuid: string }>()
  console.log('uuid:', uuid)

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
    context.setIsLoading(true)
    api
      .recoverPassword(data)
      .then((res: any) => {
        setStep(1)
      })
      .catch()
      .finally(() => {
        setStep(1) //TODO
        context.setIsLoading(false)
      })
  }

  const [step, setStep] = useState<number>(0)
  const renderStep1 = () => (
    <>
      <div className='ad-login-content-header'>
        <Button className='ad-mb-1' onClick={() => history.push('/login')}>
          Back
        </Button>
        <h1>Recover password</h1>
      </div>
      <div className='ad-login-content-body'>
        <p>Don’t worry, happens to the best of us.</p>
        <div className='ad-form-group'>
          <label>User ID or Email</label>
          <Input
            placeholder='Clear hint for the input'
            maxLength={200}
            value={data.username}
            onChange={(e) => onChange('username', e)}
          />
          <FormGroupMsg
            isShow={isEmail === false}
            type='error'
            msg='The Email format is not correct.'
          />
        </div>
        <Button type='link' onClick={() => history.push('/login/contact')}>
          Forgot user ID or Email? Contact us
        </Button>
      </div>
      <div className='ad-login-content-footer'>
        <Button
          disabled={!data.username || isEmail === false}
          type='primary'
          className='ad-login-content-actionBtn'
          block
          onClick={() => recoverPassword()}
        >
          Email me a recovery link
        </Button>
      </div>
    </>
  )
  const renderStep2 = () => (
    <>
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
          onClick={() => setStep(2)}
          // onClick={() => history.push('/')} //TODO
        >
          Continue
        </Button>
      </div>
    </>
  )
  const renderStep3 = () => (
    // TODO step3 is come in from email
    <>
      <div className='ad-login-content-header'>
        <h1>Recover password</h1>
      </div>
      <div className='ad-login-content-body'>
        <p>Your temporary password for {data.account} is</p>
        {/* TODO
         navigator.clipboard.writeText(copyText.value); */}
        {/* <CopyToClipboard
      text={tempPassword}
      onCopy={() => message.success('Copied!')}
    >
      <div className='ad-copyBox'>
        {tempPassword}
        <IconCopy />
      </div>
    </CopyToClipboard> */}
        <p>
          Please copy the password and log in, after which you will be asked to
          change password.
        </p>
      </div>
      <div className='ad-login-content-footer'>
        <Button
          type='primary'
          className='ad-login-content-actionBtn'
          block
          onClick={() => history.push('/login')}
        >
          Go to Log in
        </Button>
      </div>
    </>
  )
  return step === 0
    ? renderStep1()
    : step === 1
    ? renderStep2()
    : step === 2
    ? renderStep3()
    : null
}
export default Recover

import { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { MyContext } from '../../../storage/storage'
import FormGroupMsg from '../../../utility/component/FormGroupMsg'
import { ValidateStr, Validation } from '../../../utility/validate'
import LoginApi from '../../../api/LoginApi'
import { Button, Input } from 'antd'

const { TextArea } = Input

interface IState {
  name: string
  email: string
  account: string
  desc: string
}

const Contact = () => {
  const history = useHistory()
  const context = useContext(MyContext)
  const api = new LoginApi()

  const [isEmail, setIsEmail] = useState<boolean | undefined>(undefined)
  const [data, setData] = useState<IState>({
    name: '',
    email: '',
    account: '',
    desc: 'Can’t log in'
  })
  const onChange = (key: string, e: any) => {
    const value = e.target.value
    if (value) {
      switch (key) {
        case 'name':
          if (
            value &&
            (ValidateStr('isInt', value) || ValidateStr('isSymbol', value))
          )
            return false
          break
        case 'email':
          if (value && !ValidateStr('isUserName', value)) return false
          setIsEmail(ValidateStr('isEmail', value))
          break
        case 'account':
          if (value && !ValidateStr('isEngInt', value)) return false
          break
        case 'desc':
          if (value && ValidateStr('isSymbol', value)) return false
          break
      }
    }
    setData({ ...data, [key]: value })
  }

  const contact = () => {
    context.setIsLoading(true)

    api
      .contact(data)
      .then(() => {
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
        <h1>Contact us</h1>
      </div>
      <div className='ad-login-content-body'>
        <div className='ad-form-group'>
          <label className='required'>Full name</label>
          <Input
            placeholder={Validation.input_placeholder}
            maxLength={Validation.input_name_max}
            value={data.name}
            onChange={(e) => onChange('name', e)}
          />
        </div>
        <div className='ad-form-group'>
          <label className='required'>Your valid email</label>
          <Input
            value={data.email}
            maxLength={Validation.input_email_max}
            placeholder={Validation.input_placeholder}
            onChange={(e) => onChange('email', e)}
          />
          <FormGroupMsg
            isShow={isEmail === false}
            type='error'
            msg={Validation.errMsg_email_format_wrong}
          />
          <FormGroupMsg
            isShow={isEmail !== false}
            msg='Please provide an valid email for us to contact you.'
          />
        </div>
        <div className='ad-form-group'>
          <label>User ID</label>
          <Input
            placeholder={Validation.input_placeholder}
            maxLength={Validation.input_email_max}
            value={data.account}
            onChange={(e) => onChange('account', e)}
          />
          <FormGroupMsg
            isShow={true}
            msg='Try to help us recognize you.It’s okay to be incorrect or empty'
          />
        </div>
        <div className='ad-form-group'>
          <label>Descriptions</label>
          <TextArea
            rows={4}
            value={data.desc}
            onChange={(e) => onChange('desc', e)}
          />
        </div>
      </div>
      <div className='ad-login-content-footer'>
        <Button
          disabled={!data.name || !data.email || isEmail !== true}
          className='ad-login-content-actionBtn'
          type='primary'
          block
          onClick={() => contact()}
        >
          Submit
        </Button>
      </div>
    </>
  )
  const renderStep2 = () => (
    <>
      <div className='ad-login-content-header'>
        <h1>Successfully submitted!</h1>
      </div>
      <div className='ad-login-content-body'>
        <p>Thank you! We will try to reply you within 2 working days. </p>
      </div>
      <div className='ad-login-content-footer'>
        <Button
          className='ad-login-content-actionBtn'
          type='primary'
          block
          onClick={() => history.push('/login')}
        >
          Continue
        </Button>
      </div>
    </>
  )
  return step === 0 ? renderStep1() : step === 1 ? renderStep2() : null
}
export default Contact

import { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { MyContext } from 'storage'
import LoginApi from 'api/LoginApi'
import FormGroupMsg from 'utility/component/FormGroupMsg'
import { ValidateStr } from 'utility/validate'
import { Button, Input } from 'antd'

const { TextArea } = Input

interface IState {
  name: string
  email: string
  user_id: string
  description: string
}

const Contact = () => {
  const context = useContext(MyContext)
  const api = new LoginApi()
  const history = useHistory()

  const [isEmail, setIsEmail] = useState<boolean | undefined>(undefined)
  const [data, setData] = useState<IState>({
    name: '',
    email: '',
    user_id: '',
    description: 'Can’t log in'
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
      .finally(() => {
        setStep(1)
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
            placeholder='Clear hint for the input'
            maxLength={50}
            value={data.name}
            onChange={(e) => onChange('name', e)}
          />
        </div>
        <div className='ad-form-group'>
          <label className='required'>Your valid email</label>
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
          <FormGroupMsg
            isShow={isEmail !== false}
            msg='Please provide an valid email for us to contact you.'
          />
        </div>
        <div className='ad-form-group'>
          <label>User ID</label>
          <Input
            placeholder='Clear hint for the input'
            maxLength={200}
            value={data.user_id}
            onChange={(e) => onChange('user_id', e)}
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
            value={data.description}
            onChange={(e) => onChange('description', e)}
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

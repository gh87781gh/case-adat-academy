import { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { MyContext } from '../../../storage/storage'
import { Validation, ValidateStr } from '../../../utility/validate'
import FormGroupMsg from '../../../component/FormGroupMsg'
// import GlobalApi from '../../../api/GlobalApi'
import LoginApi from '../../../api/LoginApi'
import { Row, Col, Button, Input, Checkbox, Select } from 'antd'
const { Option } = Select

interface IState {
  account: string
  password: string
  passwordAgain?: string
  email: string
  industry: string
  profession: string
  level: string
  company: string
  experience: any
}

const Create = () => {
  const context = useContext(MyContext)
  // const globalApi = new GlobalApi()
  const api = new LoginApi()
  const history = useHistory()

  // const [optionIndustry, setOptionIndustry] = useState<any>([])
  // const [optionLevel, setOptionLevel] = useState<any>([])
  useEffect(() => {
    // TODO async and api
    // context.setIsLoading(true)
    // globalApi
    //   .getOption('industry')
    //   .then((res: any) => {
    //     setOptionIndustry(res)
    //   })
    //   .catch((err: any) => {})
    //   .finally(() => {
    //     context.setIsLoading(false)
    //   })
    // globalApi
    //   .getOption('level')
    //   .then((res: any) => {
    //     setOptionLevel(res)
    //   })
    //   .catch((err: any) => {})
    //   .finally(() => {
    //     context.setIsLoading(false)
    //   })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [isEmail, setIsEmail] = useState<boolean | undefined>(undefined)
  const [data, setData] = useState<IState>({
    account: '',
    password: '',
    passwordAgain: '',
    email: '',
    industry: '',
    profession: '',
    level: '',
    company: '',
    experience: []
  })
  const onChange = (key: string, e: any) => {
    let value = e.target.value
    if (value) {
      switch (key) {
        case 'account':
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
        case 'company':
          if (value && ValidateStr('isSymbol', value)) return false
          break
      }
    }
    setData({ ...data, [key]: value })
  }
  const onSelect = (key: string, value: any) => {
    setData({ ...data, [key]: value })
  }
  const onChecks = (checkedValues: any) => {
    if (checkedValues.includes('NOT_SURE')) {
      checkedValues.length >= 2 && checkedValues.indexOf('NOT_SURE') === 0
        ? checkedValues.shift()
        : (checkedValues = ['NOT_SURE'])
    }
    setData({ ...data, experience: checkedValues })
  }

  const checkAccount = () => {
    context.setIsLoading(true)

    const toCheck = {
      account: data.account,
      email: data.email
    }
    // TODO 需考慮正式送出時 create check 已失效的情形
    api
      .checkAccount(toCheck)
      .then(() => {
        setStep(1)
      })
      .catch()
      .finally(() => {
        setStep(1) //TODO
        context.setIsLoading(false)
      })
  }
  const create = () => {
    context.setIsLoading(true)

    const checkData = { ...data }
    delete checkData.passwordAgain

    api
      .create(checkData)
      .then(() => {
        setStep(2)
      })
      .catch()
      .finally(() => {
        setStep(2) //TODO
        context.setIsLoading(false)
      })
  }

  const [step, setStep] = useState<number>(0)
  const renderStep1 = () => (
    <>
      <div className='ad-login-content-header'>
        <h1>
          Create account
          <Button className='ad-float-right' onClick={() => history.push('/')}>
            Log in
          </Button>
        </h1>
      </div>
      <div className='ad-login-content-body'>
        <div className='ad-form-group'>
          <label className='required'>User ID</label>
          <Input
            placeholder={Validation.input_placeholder}
            maxLength={Validation.input_email_max}
            value={data.account}
            onChange={(e) => onChange('account', e)}
          />
          <FormGroupMsg
            isShow={true}
            msg='User ID is your unique identifier as a member in AIR academy'
          />
        </div>
        <div className='ad-form-group'>
          <label className='required'>Password</label>
          <Input.Password
            placeholder={Validation.input_placeholder}
            maxLength={Validation.input_password_max}
            value={data.password}
            onChange={(e) => onChange('password', e)}
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
        <div className='ad-form-group'>
          <label className='required'>Password again</label>
          <Input.Password
            placeholder={Validation.input_placeholder}
            maxLength={Validation.input_password_max}
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
            msg={Validation.errMsg_password_not_match}
          />
        </div>
        <div className='ad-form-group'>
          <label className='required'>Email</label>
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
        </div>
      </div>
      <div className='ad-login-content-footer'>
        <Button
          disabled={
            !data.account ||
            !data.password ||
            !data.passwordAgain ||
            !data.email ||
            // data.password.length < Validation.input_password_min || TODO
            data.password !== data.passwordAgain ||
            isEmail !== true
          }
          className='ad-login-content-actionBtn'
          type='primary'
          block
          onClick={() => checkAccount()}
        >
          Next
        </Button>
      </div>
    </>
  )
  const renderStep2 = () => (
    <>
      <div className='ad-login-content-header'>
        <h1>
          Create account
          <Button className='ad-float-right' onClick={() => history.push('/')}>
            Log in
          </Button>
        </h1>
      </div>
      <div className='ad-login-content-body'>
        <p>
          Help us recommend learning path for you by providing your work
          experiences
        </p>
        <Row gutter={20}>
          <Col span={12}>
            <div className='ad-form-group'>
              <label className='required'>Industry</label>
              <Select
                value={data.industry}
                placeholder='Please select'
                onChange={(val) => onSelect('industry', val)}
              >
                <Option value={'test'}>test</Option>
                {/* TODO */}
                {/* {optionIndustry.map((item: any) => (
                  <Option value={item.value} key={item.value}>
                    {item.name}
                  </Option>
                ))} */}
              </Select>
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label className='required'>Profession</label>
              <Input
                placeholder={Validation.input_placeholder}
                maxLength={50}
                value={data.profession}
                onChange={(e) => onChange('profession', e)}
              />
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label className='required'>Experience level</label>
              <Select
                placeholder='Please select'
                maxLength={50}
                value={data.level}
                onChange={(val) => onSelect('level', val)}
              >
                <Option value={'test'}>test</Option>
                {/* TODO */}
                {/* {optionLevel.map((item: any) => (
                  <Option value={item.value} key={item.value}>
                    {item.name}
                  </Option>
                ))} */}
              </Select>
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label>Current Company</label>
              <Input
                value={data.company}
                placeholder={Validation.input_placeholder}
                onChange={(e) => onChange('company', e)}
              />
            </div>
          </Col>
        </Row>
        <div className='ad-form-group'>
          <label className='required ad-clear-fix'>
            What is your experience regarding to AIR?
            <em className='ad-float-right'>multiple choices</em>
          </label>
          <Checkbox.Group
            value={data.experience}
            className='ad-checkbox-btn-group'
            onChange={onChecks}
          >
            <Row gutter={[10, 10]}>
              <Col span={12}>
                <Checkbox className='ad-checkbox-btn' value='SOP_EDITING'>
                  SOP editing
                </Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox
                  className='ad-checkbox-btn'
                  value='PROCEDURE_OPERATION'
                >
                  Procedure operation
                </Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox className='ad-checkbox-btn' value='AI_TRAINING'>
                  AI training
                </Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox className='ad-checkbox-btn' value='NOT_SURE'>
                  Not sure
                </Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </div>
      </div>
      <div className='ad-login-content-footer'>
        <Button
          disabled={
            !data.industry ||
            !data.profession ||
            !data.level ||
            data.experience.length === 0
          }
          className='ad-login-content-actionBtn'
          type='primary'
          block
          onClick={() => create()}
        >
          Next
        </Button>
        <p className='ad-color-gray'>
          by creatiing...you agree with the terms & policy
        </p>
      </div>
    </>
  )
  const renderStep3 = () => (
    <>
      <div className='ad-login-content-header'>
        <h1>Successfully created!</h1>
      </div>
      <div className='ad-login-content-body'>
        <p>We’ve send a confirmation letter to your mailbox...</p>
      </div>
      <div className='ad-login-content-footer'>
        <Button
          className='ad-login-content-actionBtn'
          type='primary'
          block
          onClick={() => history.push('/')}
        >
          Continue
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
export default Create

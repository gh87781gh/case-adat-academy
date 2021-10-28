import { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { MyContext } from '../../../storage'
import { ValidateStr } from '../../../utility/validate'
import FormGroupMsg from '../../../utility/component/FormGroupMsg'
import LoginApi from '../../../api/LoginApi'
import { Row, Col, Button, Input, Checkbox, Select } from 'antd'
const { Option } = Select

interface IState {
  user_id: string
  password: string
  passwordAgain?: string
  email: string
  industry: string
  profession: string
  current_company: string
  experience: string[]
  experience_level: string
}

const Create = () => {
  const context = useContext(MyContext)
  const api = new LoginApi()
  const history = useHistory()

  const [industries, setIndustries] = useState<any>([])
  const [experience_levels, setExperience_levels] = useState<any>([])
  const [experiences, setExperiences] = useState<any>([])
  useEffect(() => {
    context.setIsLoading(true)

    api
      .getSignUpOptions()
      .then((res: any) => {
        setIndustries(res.industries)
        setExperience_levels(res.experience_levels)
        setExperiences(res.experiences)
      })
      .catch()
      .finally(() => {
        context.setIsLoading(false)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [isEmail, setIsEmail] = useState<boolean | undefined>(undefined)
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
  const onSelect = (key: string, value: any) => {
    setData({ ...data, [key]: value })
  }
  const onChecks = (checkedValues: any) => {
    if (checkedValues.includes(3)) {
      checkedValues.length >= 2 && checkedValues.indexOf(3) === 0
        ? checkedValues.shift()
        : (checkedValues = [3])
    }
    setData({ ...data, experience: checkedValues })
  }
  const checkAccount = () => {
    context.setIsLoading(true)

    const toCheck = {
      user_id: data.user_id,
      email: data.email
    }
    api
      .checkAccount(toCheck)
      .then((is_exist: any) => {
        if (!is_exist) setStep(1)
      })
      .catch()
      .finally(() => {
        context.setIsLoading(false)
      })
  }
  const create = () => {
    context.setIsLoading(true)

    const experienceStrAry = data.experience.map((item: any) => {
      return experiences[item]
    })
    const checkData = { ...data, experience: experienceStrAry }
    delete checkData.passwordAgain

    api
      .create(checkData)
      .then(() => {
        setStep(2)
      })
      .catch()
      .finally(() => {
        context.setIsLoading(false)
      })
  }

  const [step, setStep] = useState<number>(1)
  const renderStep1 = () => (
    <>
      <div className='ad-login-content-header'>
        <h1>
          Create account
          <Button
            className='ad-float-right'
            onClick={() => history.push('/login')}
          >
            Log in
          </Button>
        </h1>
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
        <Button
          disabled={
            !data.user_id ||
            !data.password ||
            !data.passwordAgain ||
            !data.email ||
            // data.password.length < 8 || TODO
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
          <Button
            className='ad-float-right'
            onClick={() => history.push('/login')}
          >
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
                {industries.map((item: string) => (
                  <Option value={item} key={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label className='required'>Profession</label>
              <Input
                placeholder='Clear hint for the input'
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
                value={data.experience_level}
                onChange={(val) => onSelect('experience_level', val)}
              >
                {experience_levels.map((item: string) => (
                  <Option value={item} key={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label>Current Company</label>
              <Input
                value={data.current_company}
                placeholder='Clear hint for the input'
                onChange={(e) => onChange('current_company', e)}
              />
            </div>
          </Col>
        </Row>
        <div className='ad-form-group'>
          <label className='required ad-clearfix'>
            What is your experience regarding to AIR?
            <em className='ad-float-right'>multiple choices</em>
          </label>
          <Checkbox.Group
            value={data.experience}
            className='ad-checkbox-btn-group'
            onChange={onChecks}
          >
            <Row gutter={[10, 10]}>
              {experiences.map((item: string, index: number) => (
                <Col span={12} key={item}>
                  <Checkbox className='ad-checkbox-btn' value={index}>
                    {item}
                  </Checkbox>
                </Col>
              ))}
              {/* <Col span={12}>
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
              </Col> */}
            </Row>
          </Checkbox.Group>
        </div>
      </div>
      <div className='ad-login-content-footer'>
        <Button
          disabled={
            !data.industry ||
            !data.profession ||
            !data.experience_level ||
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
          onClick={() => history.push('/login')}
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

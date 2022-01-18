import { useState, useContext, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { MyContext } from 'storage'
import GlobalApi from 'api/GlobalApi'
import LoginApi from 'api/LoginApi'
import msg from 'api/engine/msg'

import LoginTemplate from 'view/login/LoginTemplate'

import { ValidateStr } from 'utility/validate'
import FormGroupMsg from 'utility/component/FormGroupMsg'
import { Btn } from 'utility/component'
import { IconArrowPrev } from 'utility/icon'
import { Row, Col, Button, Input, Checkbox, Select, message } from 'antd'
const { Option } = Select

interface IState {
  name: string
  industry: string
  position: string
  current_company: string
  experience: string[]
  experience_level: string
}

const SignUp2 = () => {
  const context = useContext(MyContext)
  const api_global = new GlobalApi()
  const api = new LoginApi()
  const history = useHistory()
  const location = useLocation()
  const { state } = location

  const [industryOption, setIndustryOption] = useState<string[]>([])
  const [experienceLevelOption, setExperienceLevelOption] = useState<string[]>(
    []
  )
  const [experienceOption, setExperienceOption] = useState<string[]>([])
  useEffect(() => {
    console.log('location:', location)
    if (!state) history.push('/login/signUp1')

    context.setIsLoading(true)
    api_global
      .getOptions([
        'learning_profile_industries',
        'learning_profile_experience_levels',
        'learning_profile_experiences'
      ])
      .then((res: any) => {
        setIndustryOption(res.data[0])
        setExperienceLevelOption(res.data[1])
        setExperienceOption(res.data[2])
      })
      .finally(() => context.setIsLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [data, setData] = useState<IState>({
    name: '',
    industry: '',
    position: '',
    current_company: '',
    experience: [],
    experience_level: ''
  })
  const onChange = (key: string, e: any) => {
    let value = e.target.value
    if (value) {
      switch (key) {
        case 'position':
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
  const signUp = () => {
    context.setIsLoading(true)

    let sendData = {}
    if (state && typeof state === 'object') sendData = { ...state, ...data }

    api
      .signUp(sendData)
      .then(() => history.push('signUpConfirm'))
      .finally(() => context.setIsLoading(false))
  }

  return (
    <LoginTemplate>
      <Btn
        style={{ marginBottom: '16px' }}
        feature='secondary'
        onClick={() => history.push('/login/signUp1')}
      >
        <IconArrowPrev />
        Back
      </Btn>
      <div className='ad-login-content-header'>SIGN UP</div>
      <div className='ad-login-content-body'>
        <p>
          Help us recommend learning path for you by providing your work
          experiences
        </p>
        <Row gutter={20}>
          <Col span={24}>
            <div className='ad-form-group'>
              <label className='required'>Full name</label>
              <Input
                placeholder='Please input'
                maxLength={50}
                value={data.name}
                onChange={(e) => onChange('name', e)}
              />
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label className='required'>Industry</label>
              <Select
                value={data.industry}
                placeholder='Please select'
                onChange={(val) => onSelect('industry', val)}
              >
                {industryOption.map((item: string) => (
                  <Option value={item} key={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label className='required'>Position</label>
              <Input
                placeholder='Clear hint for the input'
                maxLength={50}
                value={data.position}
                onChange={(e) => onChange('position', e)}
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
                {experienceLevelOption.map((item: string) => (
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
          <label className='required'>
            What is your experience regarding to AIR?
            <em className='ad-float-right'>multiple choices</em>
          </label>
          <Checkbox.Group
            value={data.experience}
            className='ad-checkbox-btn-group'
            onChange={onChecks}
          >
            <Row gutter={[10, 10]}>
              {experienceOption.map((item: string, index: number) => (
                <Col span={12} key={item}>
                  <Checkbox className='ad-checkbox-btn' value={item}>
                    {item}
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </div>
      </div>
      <div className='ad-login-content-footer'>
        <p className=''>By signning up, you agree with our terms & policy.</p>
        <Btn
          feature='action'
          disabled={
            !data.industry ||
            !data.position ||
            !data.experience_level ||
            data.experience.length === 0
          }
          className='ad-login-content-actionBtn'
          block
          onClick={() => signUp()}
        >
          Sign up
        </Btn>
      </div>
    </LoginTemplate>
  )
}
export default SignUp2

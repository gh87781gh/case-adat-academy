import { useState, useContext, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { MyContext } from 'storage'
import GlobalApi from 'api/GlobalApi'
import LoginApi from 'api/LoginApi'
// import msg from 'api/engine/msg'

import LoginTemplate from 'view/login/LoginTemplate'

import schema from 'utility/validate'
import { Btn, Input, Select, Option } from 'utility/component'
import { IconArrowPrev } from 'utility/icon'
import { Row, Col, Checkbox } from 'antd'

interface IState {
  name: string
  industry: string | null
  position: string
  current_company: string
  experience: string[]
  experience_level: string | null
}

const SignUp2 = () => {
  const context = useContext(MyContext)
  const api_global = new GlobalApi()
  const api = new LoginApi()
  const history = useHistory()
  const location = useLocation()
  const { state }: any = location
  // state is come from signUp1

  const [industryOption, setIndustryOption] = useState<string[]>([])
  const [experienceLevelOption, setExperienceLevelOption] = useState<string[]>(
    []
  )
  const [experienceOption, setExperienceOption] = useState<string[]>([])
  useEffect(() => {
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
    industry: null,
    position: '',
    current_company: '',
    experience: [],
    experience_level: null
  })
  const onChange = (key: string, e: any) => {
    let value = e.target.value
    if (value) {
      switch (key) {
        case 'name':
        case 'position':
        case 'current_company':
          if (schema[key].validateStr(value)) return false
          break
      }
    }
    setData({ ...data, [key]: value })
  }
  const onSelect = (key: string, value: any) => {
    setData({ ...data, [key]: value })
  }
  const onChecks = (checkedValues: any) => {
    if (checkedValues.includes('Not sure')) {
      checkedValues.length >= 2 && checkedValues.indexOf('Not sure') === 0
        ? checkedValues.shift()
        : (checkedValues = ['Not sure'])
    }
    setData({ ...data, experience: checkedValues })
  }

  const signUp = () => {
    context.setIsLoading(true)

    let sendData = {}
    if (state) sendData = { ...state, ...data }

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
                maxLength={50}
                value={data.name}
                onChange={(e: any) => onChange('name', e)}
              />
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label className='required'>Industry</label>
              <Select
                value={data.industry}
                onChange={(val: any) => onSelect('industry', val)}
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
                maxLength={50}
                value={data.position}
                onChange={(e: any) => onChange('position', e)}
              />
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label className='required'>Experience level</label>
              <Select
                maxLength={50}
                value={data.experience_level}
                onChange={(val: any) => onSelect('experience_level', val)}
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
                onChange={(e: any) => onChange('current_company', e)}
              />
            </div>
          </Col>
        </Row>
        <div className='ad-form-group'>
          <label className='required'>
            What is your experience regarding to AIR? (multiple choice)
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
        <p className=''>By signing up, you agree with our terms & policy.</p>
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

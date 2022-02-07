import { useState, useEffect, useContext } from 'react'
import { MyContext, StaticService } from 'storage'
import { useHistory } from 'react-router-dom'
import GlobalApi from 'api/GlobalApi'
import AccountApi from 'api/user/AccountApi'

import Header from 'view/Header'
import Footer from 'view/user/layout/Footer'
import AccountSideBar from '../AccountSideBar'

import { Btn } from 'utility/component'
import CS from 'assets/img/temp-cs.jpeg'
import { Row, Col, Breadcrumb, Checkbox, Select, Input, message } from 'antd'
const { Option } = Select
const { TextArea } = Input

interface IState {
  name: string
  industry: string
  position: string
  current_company: string
  experience_level: string
  experience: string[]
  gender: string
  age_range: string
  location: string
  highest_degree: string
  university: string
  field_or_major: string
}

const LearningProfile = () => {
  const context = useContext(MyContext)
  const api_global = new GlobalApi()
  const api = new AccountApi()
  const history = useHistory()

  const [options, setOptions] = useState<any>([])
  useEffect(() => {
    context.setIsLoading(true)
    api_global
      .getOptions([
        'learning_profile_experiences',
        'learning_profile_experience_levels',
        'learning_profile_industries',
        'learning_profile_genders',
        'learning_profile_age_ranges',
        'learning_profile_highest_degrees'
      ])
      .then((res: any) => setOptions(res.data))
      .finally(() => context.setIsLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [data, setData] = useState<IState>({
    name: '',
    gender: '',
    age_range: '',
    location: '',
    industry: '',
    position: '',
    experience_level: '',
    current_company: '',
    experience: [],
    highest_degree: '',
    university: '',
    field_or_major: ''
  })
  const onChange = (key: string, e: any) => {
    let value = e.target.value
    if (value) {
      switch (
        key
        // case 'position':
        // case 'current_company':
        //   if (value && ValidateStr('isSymbol', value)) return false
        //   break
      ) {
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
  const getLearningProfile = () => {
    context.setIsLoading(true)
    api
      .getLearningProfile()
      .then((res: any) => setData(res.data))
      .finally(() => context.setIsLoading(false))
  }
  const update = () => {
    context.setIsLoading(true)
    api
      .updateLearningProfile(data)
      .then(() => message.success('Saved'))
      .finally(() => context.setIsLoading(false))
  }
  useEffect(() => {
    getLearningProfile()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const renderForm = () => {
    return (
      <>
        <Row gutter={20}>
          <Col span={24}>
            <div className='ad-form-group'>
              <b>Basic</b>
            </div>
          </Col>
          <Col span={12}>
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
              <label>Gender</label>
              <Select
                value={data.gender}
                placeholder='Please select'
                onChange={(val) => onSelect('gender', val)}
              >
                {options[3]?.map((item: string) => (
                  <Option value={item} key={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label>Age range</label>
              <Select
                value={data.age_range}
                placeholder='Please select'
                onChange={(val) => onSelect('age_range', val)}
              >
                {options[4]?.map((item: string) => (
                  <Option value={item} key={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label>Location</label>
              <Input
                placeholder='Please input'
                maxLength={50}
                value={data.location}
                onChange={(e) => onChange('location', e)}
              />
            </div>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={24}>
            <div className='ad-form-group'>
              <b>Work experience</b>
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
                {options[2]?.map((item: string) => (
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
                placeholder='Please input'
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
                value={data.experience_level}
                placeholder='Please select'
                onChange={(val) => onSelect('experience_level', val)}
              >
                {options[1]?.map((item: string) => (
                  <Option value={item} key={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label>Current company</label>
              <Input
                placeholder='Please input'
                maxLength={50}
                value={data.current_company}
                onChange={(e) => onChange('current_company', e)}
              />
            </div>
          </Col>
          <Col span={24}>
            <div className='ad-form-group'>
              <label className='required'>
                What is your experience regarding to AIR? (multiple choices)
              </label>
              <Checkbox.Group
                value={data.experience}
                className='ad-checkbox-btn-group'
                onChange={(checkedValue) => onChecks(checkedValue)}
              >
                <Row gutter={[10, 10]}>
                  {options[0]?.map((item: string) => (
                    <Col span={6} key={item}>
                      <Checkbox className='ad-checkbox-btn' value={item}>
                        {item}
                      </Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </div>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={24}>
            <div className='ad-form-group'>
              <b>Education</b>
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label>Highest degree</label>
              <Select
                value={data.highest_degree}
                placeholder='Please select'
                onChange={(val) => onSelect('highest_degree', val)}
              >
                {options[5]?.map((item: string) => (
                  <Option value={item} key={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label>University</label>
              <Input
                placeholder='Please input'
                maxLength={50}
                value={data.university}
                onChange={(e) => onChange('university', e)}
              />
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label>Field or major</label>
              <Input
                placeholder='Please input'
                maxLength={50}
                value={data.field_or_major}
                onChange={(e) => onChange('field_or_major', e)}
              />
            </div>
          </Col>
        </Row>
      </>
    )
  }
  return (
    <>
      <Header />
      <div style={{ overflowX: 'hidden' }}>
        <Row gutter={20}>
          <Col span={5}>
            <AccountSideBar />
          </Col>
          <Col span={17}>
            <article className='ad-page-container'>
              <h1 className='ad-title'>Learning profile</h1>
              {renderForm()}
              <div className='ad-page-container-footer'>
                <div className='ad-btn-group'>
                  <Btn
                    disabled={
                      !data.name ||
                      !data.industry ||
                      !data.position ||
                      !data.experience_level ||
                      data.experience.length === 0
                    }
                    feature='action'
                    key='Submit'
                    onClick={() => update()}
                  >
                    Submit
                  </Btn>
                  <Btn
                    feature='primary'
                    key='Cancel'
                    // onClick={() => submit()}
                  >
                    Cancel
                  </Btn>
                </div>
              </div>
            </article>
          </Col>
        </Row>
      </div>
      <Footer />
    </>
  )
}
export default LearningProfile

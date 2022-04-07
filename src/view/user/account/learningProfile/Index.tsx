import { useState, useEffect, useContext } from 'react'
import { MyContext, StaticService } from 'storage'
import GlobalApi from 'api/GlobalApi'
import AccountApi from 'api/user/AccountApi'

import Header from 'view/user/layout/Header'
import Footer from 'view/user/layout/Footer'
import AccountSideBar from '../AccountSideBar'

import schema from 'utility/validate'
import { Btn } from 'utility/component'
import { Row, Col, Checkbox, Select, Input, message } from 'antd'
const { Option } = Select

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
      switch (key) {
        case 'name':
        case 'location':
        case 'position':
        case 'current_company':
        case 'university':
        case 'field_or_major':
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
  const getUserProfile = () => {
    context.setIsLoading(true)
    api
      .getUserProfile()
      .then((res: any) => setData(res.data))
      .finally(() => context.setIsLoading(false))
  }
  const update = () => {
    context.setIsLoading(true)
    api
      .updateUserProfile(data)
      .then(() => message.success('Saved'))
      .finally(() => context.setIsLoading(false))
  }
  useEffect(() => {
    getUserProfile()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const renderForm = () => {
    return (
      <>
        <Row gutter={20}>
          <Col span={24}>
            <div className='aa-form-group'>
              <b>Basic</b>
            </div>
          </Col>
          <Col span={12}>
            <div className='aa-form-group'>
              <label className='required'>Full name</label>
              <Input
                placeholder={StaticService.placeholder.input}
                maxLength={50}
                value={data.name}
                onChange={(e) => onChange('name', e)}
              />
            </div>
          </Col>
          <Col span={12}>
            <div className='aa-form-group'>
              <label>Gender</label>
              <Select
                value={data.gender || undefined}
                placeholder={StaticService.placeholder.select}
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
            <div className='aa-form-group'>
              <label>Age range</label>
              <Select
                value={data.age_range || undefined}
                placeholder={StaticService.placeholder.select}
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
            <div className='aa-form-group'>
              <label>Location</label>
              <Input
                placeholder={StaticService.placeholder.input}
                maxLength={schema.location.max}
                value={data.location}
                onChange={(e) => onChange('location', e)}
              />
            </div>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={24}>
            <div className='aa-form-group'>
              <b>Work experience</b>
            </div>
          </Col>
          <Col span={12}>
            <div className='aa-form-group'>
              <label className='required'>Industry</label>
              <Select
                value={data.industry || undefined}
                placeholder={StaticService.placeholder.select}
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
            <div className='aa-form-group'>
              <label className='required'>Position</label>
              <Input
                placeholder={StaticService.placeholder.input}
                maxLength={schema.position.max}
                value={data.position}
                onChange={(e) => onChange('position', e)}
              />
            </div>
          </Col>
          <Col span={12}>
            <div className='aa-form-group'>
              <label className='required'>Experience level</label>
              <Select
                value={data.experience_level || undefined}
                placeholder={StaticService.placeholder.select}
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
            <div className='aa-form-group'>
              <label>Current company</label>
              <Input
                placeholder={StaticService.placeholder.input}
                maxLength={schema.current_company.max}
                value={data.current_company}
                onChange={(e) => onChange('current_company', e)}
              />
            </div>
          </Col>
          <Col span={24}>
            <div className='aa-form-group'>
              <label className='required'>
                What is your experience regarding to AIR? (multiple choices)
              </label>
              <Checkbox.Group
                value={data.experience}
                className='aa-checkbox-btn-group'
                onChange={(checkedValue) => onChecks(checkedValue)}
              >
                <Row gutter={[10, 10]}>
                  {options[0]?.map((item: string) => (
                    <Col span={6} key={item}>
                      <Checkbox className='aa-checkbox-btn' value={item}>
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
            <div className='aa-form-group'>
              <b>Education</b>
            </div>
          </Col>
          <Col span={12}>
            <div className='aa-form-group'>
              <label>Highest degree</label>
              <Select
                value={data.highest_degree || undefined}
                placeholder={StaticService.placeholder.select}
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
            <div className='aa-form-group'>
              <label>University</label>
              <Input
                placeholder={StaticService.placeholder.input}
                maxLength={schema.university.max}
                value={data.university}
                onChange={(e) => onChange('university', e)}
              />
            </div>
          </Col>
          <Col span={12}>
            <div className='aa-form-group'>
              <label>Field or major</label>
              <Input
                placeholder={StaticService.placeholder.input}
                maxLength={schema.field_or_major.max}
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
          <Col span={19}>
            <article className='aa-page-container aa-page-container-account'>
              <h1 className='aa-title'>Learning profile</h1>
              {renderForm()}
              <div className='aa-page-container-footer'>
                <div className='aa-btn-group'>
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
                    Save
                  </Btn>
                  <Btn
                    feature='primary'
                    key='Cancel'
                    onClick={() => getUserProfile()}
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

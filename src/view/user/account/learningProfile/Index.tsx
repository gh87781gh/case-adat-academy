import { useState, useEffect, useContext } from 'react'
import { MyContext, StaticService } from 'storage'
import { useHistory } from 'react-router-dom'
import GlobalApi from 'api/GlobalApi'
import CourseApi from 'api/user/CourseApi'

import Header from 'view/layout/Header'
import Footer from 'view/layout/Footer'
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
  const api = new CourseApi()
  const history = useHistory()

  const [supportTypeOption, setSupportTypeOption] = useState<any>([])
  const [productOption, setProductOption] = useState<any>([])
  const [frequencyOption, setFrequencyOption] = useState<any>([])
  useEffect(() => {
    context.setIsLoading(true)
    api_global
      .getOptions([
        'help_center_support_types',
        'help_center_products',
        'help_center_frequencies'
      ])
      .then((res: any) => {
        setSupportTypeOption(res.data[0])
        setProductOption(res.data[1])
        setFrequencyOption(res.data[2])
        // setData({
        //   ...data,
        //   contry_code: StaticService.countryCodeOption[0].code
        // })
      })
      .finally(() => context.setIsLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [data, setData] = useState<IState>({
    name: '',
    industry: '',
    position: '',
    current_company: '',
    experience_level: '',
    experience: [],
    gender: '',
    age_range: '',
    location: '',
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
  const onChecks = (key: string, checkedValues: any) => {
    console.log(key, checkedValues)
    // switch (key) {
    //   case 'support_type':
    //     setData({ ...data, support_type: '' })
    //     setData({
    //       ...data,
    //       support_type: data.support_type ? checkedValues[1] : checkedValues[0]
    //     })
    //     break
    //   case 'prefered_way_of_contact':
    //     setData({ ...data, prefered_way_of_contact: checkedValues })
    //     break
    // }
  }

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
                {/* {genderOption.map((item: string) => (
                <Option value={item} key={item}>
                  {item}
                </Option>
              ))} */}
              </Select>
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label>Age range</label>
              <Select
                value={data.gender}
                placeholder='Please select'
                onChange={(val) => onSelect('gender', val)}
              >
                {/* {genderOption.map((item: string) => (
                <Option value={item} key={item}>
                  {item}
                </Option>
              ))} */}
              </Select>
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label>Location</label>
              <Input
                placeholder='Please input'
                maxLength={50}
                value={data.name}
                onChange={(e) => onChange('name', e)}
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
                value={data.gender}
                placeholder='Please select'
                onChange={(val) => onSelect('gender', val)}
              >
                {/* {genderOption.map((item: string) => (
                <Option value={item} key={item}>
                  {item}
                </Option>
              ))} */}
              </Select>
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label className='required'>Position</label>
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
              <label className='required'>Experience level</label>
              <Select
                value={data.gender}
                placeholder='Please select'
                onChange={(val) => onSelect('gender', val)}
              >
                {/* {genderOption.map((item: string) => (
                <Option value={item} key={item}>
                  {item}
                </Option>
              ))} */}
              </Select>
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label>Current company</label>
              <Input
                placeholder='Please input'
                maxLength={50}
                value={data.name}
                onChange={(e) => onChange('name', e)}
              />
            </div>
          </Col>
          <Col span={24}>
            <div className='ad-form-group'>
              <label className='required'>
                What is your experience regarding to AIR? (multiple choices)
              </label>
              <Checkbox.Group
                // value={[data.support_type]}
                className='ad-checkbox-btn-group'
                onChange={(checkedValue) =>
                  onChecks('support_type', checkedValue)
                }
              >
                <Row gutter={[10, 10]}>
                  {/* {supportTypeOption.map((item: string, index: number) => (
                    <Col span={12} key={item}>
                      <Checkbox className='ad-checkbox-btn' value={item}>
                        {item}
                      </Checkbox>
                    </Col>
                  ))} */}
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
                value={data.gender}
                placeholder='Please select'
                onChange={(val) => onSelect('gender', val)}
              >
                {/* {genderOption.map((item: string) => (
                <Option value={item} key={item}>
                  {item}
                </Option>
              ))} */}
              </Select>
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label>University</label>
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
              <label>Field or major</label>
              <Input
                placeholder='Please input'
                maxLength={50}
                value={data.name}
                onChange={(e) => onChange('name', e)}
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
                    // disabled={
                    // !data.support_type ||
                    // !data.subject ||
                    // !data.description ||
                    // !data.contry_code ||
                    // !data.phone_number ||
                    // (data.support_type === 'Operation questions' &&
                    //   (!data.product ||
                    //     !data.issue_happen_time ||
                    //     !data.frequency)) ||
                    // data.prefered_way_of_contact.length === 0 ||
                    // (data.prefered_way_of_contact.includes('Email') &&
                    //   !data.email)
                    // }
                    feature='action'
                    key='submit'
                    // onClick={() => submit()}
                  >
                    Submit
                  </Btn>
                  <Btn
                    // disabled={
                    // !data.support_type ||
                    // !data.subject ||
                    // !data.description ||
                    // !data.contry_code ||
                    // !data.phone_number ||
                    // (data.support_type === 'Operation questions' &&
                    //   (!data.product ||
                    //     !data.issue_happen_time ||
                    //     !data.frequency)) ||
                    // data.prefered_way_of_contact.length === 0 ||
                    // (data.prefered_way_of_contact.includes('Email') &&
                    //   !data.email)
                    // }
                    feature='primary'
                    key='submit'
                    // onClick={() => submit()}
                  >
                    Submit
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

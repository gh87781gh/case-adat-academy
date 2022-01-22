import { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { MyContext } from 'storage'
// import GlobalApi from 'api/GlobalApi'
import LoginApi from 'api/LoginApi'

import LoginTemplate from '../LoginTemplate'

import { Btn, FormGroupMsg } from 'utility/component'
import { ValidateStr } from 'utility/validate'
import { IconArrowPrev } from 'utility/icon'
import { Row, Col, Input, Checkbox, Select } from 'antd'
const { Option } = Select

interface IState {
  name: string
  subject: string
  description: string
  prefered_way_of_contact: string
  email: string
  contry_code: string
  phone_number: string
}

const Contact = () => {
  const context = useContext(MyContext)
  // const api_global = new GlobalApi()
  const api = new LoginApi()
  const history = useHistory()

  const [wayOption, setWayOption] = useState<string[]>([])
  const [contryOption, setContryOption] = useState<string[]>([])
  useEffect(() => {
    // console.log('location:', location)
    // if (!state) history.push('/login/signUp1')
    // context.setIsLoading(true)
    // api_global
    //   .getOptions([
    //     'learning_profile_industries',
    //     'learning_profile_experience_levels',
    //     'learning_profile_experiences'
    //   ])
    //   .then((res: any) => {
    //     setIndustryOption(res.data[0])
    //     setExperienceLevelOption(res.data[1])
    //     setExperienceOption(res.data[2])
    //   })
    //   .finally(() => context.setIsLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [isEmail, setIsEmail] = useState<boolean | undefined>(undefined)
  const [data, setData] = useState<IState>({
    name: '',
    subject: '',
    description: '',
    prefered_way_of_contact: '',
    email: '',
    contry_code: '886', //TODO 國碼？
    phone_number: ''
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
  const onSelect = (key: string, value: any) => {
    setData({ ...data, [key]: value })
  }
  const onChecks = (checkedValues: any) => {
    if (checkedValues.includes(3)) {
      checkedValues.length >= 2 && checkedValues.indexOf(3) === 0
        ? checkedValues.shift()
        : (checkedValues = [3])
    }
    // setData({ ...data, experience: checkedValues })
  }

  const contact = () => {
    context.setIsLoading(true)
    api
      .contact(data)
      .then(() => history.push('/login/contact2'))
      .finally(() => {
        context.setIsLoading(false)
      })
  }

  return (
    <LoginTemplate>
      <Btn
        style={{ marginBottom: '16px' }}
        feature='secondary'
        onClick={() => history.push('/login')}
      >
        <IconArrowPrev />
        Back
      </Btn>
      <div className='ad-login-content-header'>Contact us</div>
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
          <label className='required'>Subject</label>
          <Input
            value={data.subject}
            maxLength={200}
            placeholder='Clear hint for the input'
            onChange={(e) => onChange('subject', e)}
          />
        </div>
        <div className='ad-form-group'>
          <label className='required'>Description</label>
          <Input
            placeholder='Clear hint for the input'
            maxLength={200}
            value={data.description}
            onChange={(e) => onChange('description', e)}
          />
          <FormGroupMsg
            isShow={true}
            msg='Try to help us recognize you.It’s okay to be incorrect or empty'
          />
        </div>
        <div className='ad-form-group'>
          <label className='required'>
            Your prefered way of contact (multiple choice)
          </label>
          <Checkbox.Group
            // value={data.prefered_way_of_contact}
            className='ad-checkbox-btn-group'
            onChange={onChecks}
          >
            <Row gutter={[10, 10]}>
              {wayOption.map((item: string, index: number) => (
                <Col span={12} key={item}>
                  <Checkbox className='ad-checkbox-btn' value={item}>
                    {item}
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
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
        <div className='ad-form-group' style={{ marginBottom: '0' }}>
          <label className='required'>Phone number</label>
        </div>
        <Row gutter={20}>
          <Col span={6}>
            <div className='ad-form-group'>
              <Select
                value={data.contry_code}
                placeholder='Please select'
                onChange={(val) => onSelect('contry_code', val)}
              >
                {contryOption.map((item: string) => (
                  <Option value={item} key={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col span={18}>
            <div className='ad-form-group'>
              <Input
                placeholder='Please input'
                maxLength={50}
                value={data.phone_number}
                onChange={(e) => onChange('phone_number', e)}
              />
            </div>
          </Col>
        </Row>
      </div>
      <div className='ad-login-content-footer'>
        <Btn
          feature='action'
          // disabled={
          //   !data.industry ||
          //   !data.position ||
          //   !data.experience_level ||
          //   data.experience.length === 0
          // }
          className='ad-login-content-actionBtn'
          block
          onClick={() => contact()}
        >
          Submit
        </Btn>
      </div>
    </LoginTemplate>
  )
}
export default Contact

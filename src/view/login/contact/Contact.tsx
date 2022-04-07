import { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { MyContext, StaticService } from 'storage'
import GlobalApi from 'api/GlobalApi'
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
  prefered_way_of_contact: string[]
  email: string
  contry_code: string
  phone_number: string
}

const Contact = () => {
  const context = useContext(MyContext)
  const api_global = new GlobalApi()
  const api = new LoginApi()
  const history = useHistory()

  const [preferWayOption, setPreferWayOption] = useState<string[]>([])
  useEffect(() => {
    context.setIsLoading(true)
    api_global
      .getOptions(['contact_us_prefered_way_of_contact'])
      .then((res: any) => {
        setPreferWayOption(res.data[0])
      })
      .finally(() => context.setIsLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [isEmail, setIsEmail] = useState<boolean | undefined>(undefined)
  const [data, setData] = useState<IState>({
    name: '',
    subject: '',
    description: '',
    prefered_way_of_contact: [],
    email: '',
    contry_code: '+886',
    phone_number: ''
  })
  const onChange = (key: string, e: any) => {
    const value = e.target.value
    if (value) {
      switch (key) {
        // case 'name':
        //   if (
        //     value &&
        //     (ValidateStr('isInt', value) || ValidateStr('isSymbol', value))
        //   )
        //     return false
        //   break
        case 'email':
          // if (value && !ValidateStr('isUserName', value)) return false
          setIsEmail(ValidateStr('isEmail', value))
          break
        // case 'account':
        //   if (value && !ValidateStr('isEngInt', value)) return false
        //   break
        // case 'desc':
        //   if (value && ValidateStr('isSymbol', value)) return false
        //   break
      }
    }
    setData({ ...data, [key]: value })
  }
  const onSelect = (key: string, value: any) => {
    setData({ ...data, [key]: value })
  }
  const onChecks = (checkedValues: any) => {
    setData({ ...data, prefered_way_of_contact: checkedValues })
  }

  const contact = () => {
    context.setIsLoading(true)
    api
      .contact(data)
      .then(() => history.push('/login/successfully/submitted'))
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
      <div className='aa-login-content-header'>Contact us</div>
      <div className='aa-login-content-body'>
        <div className='aa-form-group'>
          <label className='required'>Full name</label>
          <Input
            placeholder='Clear hint for the input'
            maxLength={50}
            value={data.name}
            onChange={(e) => onChange('name', e)}
          />
        </div>
        <div className='aa-form-group'>
          <label className='required'>Subject</label>
          <Input
            value={data.subject}
            maxLength={200}
            placeholder='Clear hint for the input'
            onChange={(e) => onChange('subject', e)}
          />
        </div>
        <div className='aa-form-group'>
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
        <div className='aa-form-group'>
          <label className='required'>
            Your prefered way of contact (multiple choice)
          </label>
          <Checkbox.Group
            value={data.prefered_way_of_contact}
            className='aa-checkbox-btn-group'
            onChange={onChecks}
          >
            <Row gutter={[10, 10]}>
              {preferWayOption.map((item: string) => (
                <Col span={12} key={item}>
                  <Checkbox className='aa-checkbox-btn' value={item}>
                    {item}
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </div>
        <div className='aa-form-group'>
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
        {data.prefered_way_of_contact.includes('Phone number') ? (
          <>
            <div className='aa-form-group' style={{ marginBottom: '0' }}>
              <label className='required'>Phone number</label>
            </div>
            <Row gutter={20}>
              <Col span={6}>
                <div className='aa-form-group'>
                  <Select
                    value={data.contry_code || undefined}
                    placeholder={StaticService.placeholder.Select}
                    onChange={(val) => onSelect('contry_code', val)}
                  >
                    {StaticService.countryCodeOption.map((item: string) => (
                      <Option value={item} key={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>
              <Col span={18}>
                <div className='aa-form-group'>
                  <Input
                    placeholder='Please input'
                    maxLength={50}
                    value={data.phone_number}
                    onChange={(e) => onChange('phone_number', e)}
                  />
                </div>
              </Col>
            </Row>
          </>
        ) : null}
      </div>
      <div className='aa-login-content-footer'>
        <Btn
          feature='action'
          disabled={
            !data.name ||
            !data.subject ||
            !data.description ||
            data.prefered_way_of_contact.length === 0 ||
            (data.prefered_way_of_contact.includes('Phone number') &&
              !data.contry_code &&
              !data.phone_number) ||
            !data.email ||
            isEmail === false
          }
          className='aa-login-content-actionBtn'
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

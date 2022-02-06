import { useState, useEffect, useContext } from 'react'
import { MyContext, StaticService } from 'storage'
import { useHistory } from 'react-router-dom'
import GlobalApi from 'api/GlobalApi'
import HelpCenterApi from 'api/user/HelpCenter'

import Header from 'view/layout/Header'
import Footer from 'view/layout/Footer'
import { UploadImg } from 'utility/component'

// TODO
import CS from 'assets/img/temp-cs.jpeg'

import { Btn } from 'utility/component'
import { Row, Col, Breadcrumb, Checkbox, Select, Input, message } from 'antd'
const { Option } = Select
const { TextArea } = Input

interface IState {
  support_type: string
  subject: string
  product: string
  issue_happen_time: string
  frequency: string
  product_version: string
  description: string
  attachment_image_id: string
  prefered_way_of_contact: string[]
  contry_code: string
  phone_number: string
  email: string
}

const ContactUs = () => {
  const context = useContext(MyContext)
  const api_global = new GlobalApi()
  const api = new HelpCenterApi()
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
        setData({
          ...data,
          contry_code: StaticService.countryCodeOption[0].code
        })
      })
      .finally(() => context.setIsLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [data, setData] = useState<IState>({
    support_type: '',
    subject: '',
    product: '',
    issue_happen_time: '',
    frequency: '',
    product_version: '',
    description: '',
    attachment_image_id: '',
    prefered_way_of_contact: [],
    contry_code: '',
    phone_number: '',
    email: '' //TOCHECK 少了這個參數
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
    switch (key) {
      case 'support_type':
        setData({ ...data, support_type: '' })
        setData({
          ...data,
          support_type: data.support_type ? checkedValues[1] : checkedValues[0]
        })
        break
      case 'prefered_way_of_contact':
        setData({ ...data, prefered_way_of_contact: checkedValues })
        break
    }
  }

  const submit = () => {
    context.setIsLoading(true)
    api
      .sendHelpCenterContactUs(data)
      .then(() => {
        message.success('Submitted')
        history.push('/helpCenter')
      })
      .finally(() => context.setIsLoading(false))
  }

  const renderContactUsForm = () => {
    return (
      <Row gutter={20}>
        <Col span={24}>
          <div className='ad-form-group'>
            <label className='required'>Support type</label>
            <Checkbox.Group
              value={[data.support_type]}
              className='ad-checkbox-btn-group'
              onChange={(checkedValue) =>
                onChecks('support_type', checkedValue)
              }
            >
              <Row gutter={[10, 10]}>
                {supportTypeOption.map((item: string, index: number) => (
                  <Col span={12} key={item}>
                    <Checkbox className='ad-checkbox-btn' value={item}>
                      {item}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </div>
        </Col>
        <Col span={24}>
          <div className='ad-form-group'>
            <label className='required'>Subject</label>
            <Input
              placeholder='Please input'
              maxLength={50}
              value={data.subject}
              onChange={(e) => onChange('subject', e)}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className='ad-form-group'>
            <label className='required'>Product</label>
            <Select
              value={data.product}
              placeholder='Please select'
              onChange={(val) => onSelect('product', val)}
            >
              {productOption.map((item: string) => (
                <Option value={item} key={item}>
                  {item}
                </Option>
              ))}
            </Select>
          </div>
        </Col>
        <Col span={24}>
          <div className='ad-form-group'>
            <label className='required'>Issue happen time</label>
            <Select
              value={data.issue_happen_time}
              placeholder='Please select'
              onChange={(val) => onSelect('industry', val)}
            >
              {/* TOCHECK 少這個 api 參數 */}
              {/* {frequencyOption.map((item: string) => (
                <Option value={item} key={item}>
                  {item}
                </Option>
              ))} */}
            </Select>
          </div>
        </Col>
        <Col span={24}>
          <div className='ad-form-group'>
            <label className='required'>Issue happen frequency</label>
            <Select
              value={data.frequency}
              placeholder='Please select'
              onChange={(val) => onSelect('frequency', val)}
            >
              {frequencyOption.map((item: string) => (
                <Option value={item} key={item}>
                  {item}
                </Option>
              ))}
            </Select>
          </div>
        </Col>
        <Col span={24}>
          <div className='ad-form-group'>
            <label className='required'>Product version</label>
            {/* TOCHECK 建議改用 select */}
            <Input
              placeholder='Please input'
              maxLength={50}
              value={data.product_version}
              onChange={(e) => onChange('product_version', e)}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className='ad-form-group'>
            <label className='required'>
              Descriptions (operation process, issue details,etc)
            </label>
            <TextArea
              autoSize={true}
              value={data.description}
              onChange={(e) => onChange('description', e)}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className='ad-form-group'>
            <label>Attachment</label>
            <UploadImg
              type='rectangle'
              desc='Browse file'
              system='temp'
              systemId=''
              imgId={''}
              // imgId={data.logo_image_id}
              // setUploadId={(id: string) => onUpload('logo_image_id', id)}
              setUploadId={(id: string) => console.log('onUpload')}
            />
            <p className='ad-upload-info'>This is the description area</p>
          </div>
        </Col>
        <Col span={24}>
          <div className='ad-form-group'>
            <label className='required'>
              Preferred way of contact (multiple choice)
            </label>
            <Checkbox.Group
              value={data.prefered_way_of_contact}
              className='ad-checkbox-btn-group'
              onChange={(checkedValue) =>
                onChecks('prefered_way_of_contact', checkedValue)
              }
            >
              <Row gutter={[10, 10]}>
                <Col span={12} key={'Phone number'}>
                  <Checkbox className='ad-checkbox-btn' value={'Phone number'}>
                    Phone number
                  </Checkbox>
                </Col>
                <Col span={12} key={'Email'}>
                  <Checkbox className='ad-checkbox-btn' value={'Email'}>
                    Email
                  </Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </div>
        </Col>
        <Col span={24}>
          <div className='ad-form-group' style={{ marginBottom: '0' }}>
            <label className='required'>Phone number</label>
          </div>
          <Row gutter={20}>
            <Col span={6}>
              <div className='ad-form-group'>
                <Select
                  value={data.contry_code}
                  maxLength={10}
                  placeholder='Please select'
                  onChange={(val) => onSelect('contry_code', val)}
                >
                  {/* TOCHECK 國碼？ */}
                  {StaticService.countryCodeOption.map((country: any) => (
                    <Option value={country.code} key={country.code}>
                      {country.country} {country.code}
                    </Option>
                  ))}
                </Select>
              </div>
            </Col>
            <Col span={18}>
              <div className='ad-form-group'>
                <Input
                  placeholder='Please input'
                  maxLength={15}
                  value={data.phone_number}
                  onChange={(e) => onChange('phone_number', e)}
                />
              </div>
            </Col>
          </Row>
        </Col>
        {data.prefered_way_of_contact.includes('Email') ? (
          <Col span={24}>
            <div className='ad-form-group'>
              <label className='required'>Email</label>
              <Input
                placeholder='Please input'
                maxLength={50}
                value={data.email}
                onChange={(e) => onChange('email', e)}
              />
            </div>
          </Col>
        ) : null}
      </Row>
    )
  }
  const renderHelpCenterDesc = () => {
    return (
      <div className='ad-helpCenter-desc'>
        <p>
          We will try to reach you within <b>2</b> working days. Our team
          members are here for you:
        </p>
        <div className='ad-helpCenter-desc-cs'>
          <img src={CS} alt='' />
          <h4>Demmy</h4>
        </div>
        <div className='ad-helpCenter-desc-cs'>
          <img src={CS} alt='' />
          <h4>Violet</h4>
        </div>
        <div className='ad-helpCenter-desc-cs'>
          <img src={CS} alt='' />
          <h4>Aster</h4>
        </div>
      </div>
    )
  }
  return (
    <>
      <Header />
      <div className='ad-breadcrumb'>
        <Breadcrumb separator='|'>
          <Breadcrumb.Item onClick={() => history.push('/helpCenter')}>
            <Btn feature='link'>Help center</Btn>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <b>Contact us</b>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <article className='ad-page-container'>
        <h1 className='ad-title'>Dedicated team, On-time help</h1>
        <Row gutter={20}>
          <Col span={16}>
            {renderContactUsForm()}
            <div className='ad-page-container-footer'>
              <Btn
                disabled={
                  !data.support_type ||
                  !data.subject ||
                  !data.description ||
                  !data.contry_code ||
                  !data.phone_number ||
                  (data.support_type === 'Operation questions' &&
                    (!data.product ||
                      !data.issue_happen_time ||
                      !data.frequency)) ||
                  data.prefered_way_of_contact.length === 0 ||
                  (data.prefered_way_of_contact.includes('Email') &&
                    !data.email)
                }
                feature='action'
                block
                key='submit'
                onClick={() => submit()}
              >
                Submit
              </Btn>
            </div>
          </Col>
          <Col span={8} className='ad-text-right'>
            {renderHelpCenterDesc()}
          </Col>
        </Row>
      </article>
      <Footer />
    </>
  )
}
export default ContactUs

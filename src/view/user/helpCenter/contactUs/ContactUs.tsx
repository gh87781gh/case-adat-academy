import { useState, useEffect, useContext } from 'react'
import { MyContext, StaticService } from 'storage'
import { useHistory } from 'react-router-dom'
import GlobalApi from 'api/GlobalApi'
import HelpCenterApi from 'api/user/HelpCenter'

import Header from 'view/user/layout/Header'
import Footer from 'view/user/layout/Footer'
import { UploadImg } from 'utility/component'

// TODO 等真正的照片
import CS from 'assets/img/temp-cs.jpeg'

import schema from 'utility/validate'
import { Btn } from 'utility/component'
import {
  Row,
  Col,
  Breadcrumb,
  Checkbox,
  Select,
  Input,
  message,
  DatePicker
} from 'antd'
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
}

const ContactUs = () => {
  const context = useContext(MyContext)
  const api_global = new GlobalApi()
  const api = new HelpCenterApi()
  const history = useHistory()

  // option
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
          support_type: res.data[0][0]
        })
      })
      .finally(() => context.setIsLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // data
  const [data, setData] = useState<IState>({
    support_type: '',
    subject: '',
    product: '',
    issue_happen_time: '',
    frequency: '',
    product_version: '',
    description: '',
    attachment_image_id: '',
    prefered_way_of_contact: ['Phone number'],
    contry_code: StaticService.countryCodeOption[0].code,
    phone_number: ''
  })
  const onChange = (key: string, e: any) => {
    let value = e.target.value
    if (value) {
      switch (key) {
        case 'subject':
        case 'product_version':
        case 'description':
        case 'phone_number':
          if (schema[key].validateStr(value)) return false
          break
      }
    }
    setData({ ...data, [key]: value })
  }
  const onSelect = (key: string, value: any) => {
    setData({ ...data, [key]: value })
  }
  const onChecks = (key: string, checkedValues: any) => {
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
  const onDatePick = (date: any, dateStr: string) => {
    setData({ ...data, issue_happen_time: dateStr })
  }
  const onUpload = (key: string, value: string) => {
    setData({ ...data, [key]: value })
  }
  useEffect(() => {
    if (!data.prefered_way_of_contact.includes('Phone number')) {
      setData({
        ...data,
        contry_code: StaticService.countryCodeOption[0].code,
        phone_number: ''
      })
    }
  }, [data.prefered_way_of_contact]) // eslint-disable-line react-hooks/exhaustive-deps

  // api
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

  // render
  const renderContactUsForm = () => {
    return (
      <Row gutter={20}>
        <Col span={24}>
          <div className='aa-form-group'>
            <label className='required'>Support type</label>
            <Checkbox.Group
              value={[data.support_type]}
              className='aa-checkbox-btn-group'
              onChange={(checkedValue) =>
                onChecks('support_type', checkedValue)
              }
            >
              <Row gutter={[10, 10]}>
                {supportTypeOption.map((item: string, index: number) => (
                  <Col span={12} key={item}>
                    <Checkbox className='aa-checkbox-btn' value={item}>
                      {item}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </div>
        </Col>
        <Col span={24}>
          <div className='aa-form-group'>
            <label className='required'>Subject</label>
            <Input
              placeholder={StaticService.placeholder.input}
              maxLength={schema.subject.max}
              value={data.subject}
              onChange={(e) => onChange('subject', e)}
            />
          </div>
        </Col>
        {data.support_type === 'Operation questions' ? (
          <>
            <Col span={24}>
              <div className='aa-form-group'>
                <label className='required'>Product</label>
                <Select
                  value={data.product || undefined}
                  placeholder={StaticService.placeholder.select}
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
            <Col span={12}>
              <div className='aa-form-group'>
                <label className='required'>Issue happen time</label>
                <DatePicker onChange={onDatePick} />
              </div>
            </Col>
            <Col span={12}>
              <div className='aa-form-group'>
                <label className='required'>Issue happen frequency</label>
                <Select
                  value={data.frequency || undefined}
                  placeholder={StaticService.placeholder.select}
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
              <div className='aa-form-group'>
                <label className='required'>Product version</label>
                <Input
                  placeholder={StaticService.placeholder.input}
                  maxLength={schema.product_version.max}
                  value={data.product_version}
                  onChange={(e) => onChange('product_version', e)}
                />
              </div>
            </Col>
          </>
        ) : null}
        <Col span={24}>
          <div className='aa-form-group'>
            <label className='required'>
              Descriptions (operation process, issue details,etc)
            </label>
            <TextArea
              placeholder={StaticService.placeholder.input}
              maxLength={schema.description.max}
              autoSize={true}
              value={data.description}
              onChange={(e) => onChange('description', e)}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className='aa-form-group'>
            <label>Attachment</label>
            <UploadImg
              type='rectangle'
              desc='Browse file'
              system='help_center'
              systemId='' //TOCHECK 這邊是不用 id 的對吧？
              imgId={data.attachment_image_id}
              setUploadId={(id: string) => onUpload('attachment_image_id', id)}
            />
            <p className='aa-upload-info'>This is the description area</p>
          </div>
        </Col>
        <Col span={24}>
          <div className='aa-form-group'>
            <label className='required'>
              Preferred way of contact (multiple choice)
            </label>
            <Checkbox.Group
              value={data.prefered_way_of_contact}
              className='aa-checkbox-btn-group'
              onChange={(checkedValue) =>
                onChecks('prefered_way_of_contact', checkedValue)
              }
            >
              <Row gutter={[10, 10]}>
                <Col span={12} key={'Phone number'}>
                  <Checkbox className='aa-checkbox-btn' value={'Phone number'}>
                    Phone number
                  </Checkbox>
                </Col>
                <Col span={12} key={'Email'}>
                  <Checkbox className='aa-checkbox-btn' value={'Email'}>
                    Email
                  </Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </div>
        </Col>
        {data.prefered_way_of_contact.includes('Phone number') ? (
          <Col span={24}>
            <div className='aa-form-group' style={{ marginBottom: '0' }}>
              <label className='required'>Phone number</label>
            </div>
            <Row gutter={20}>
              <Col span={6}>
                <div className='aa-form-group'>
                  <Select
                    value={data.contry_code || undefined}
                    placeholder={StaticService.placeholder.select}
                    onChange={(val) => onSelect('contry_code', val)}
                  >
                    {StaticService.countryCodeOption.map((country: any) => (
                      <Option value={country.code} key={country.code}>
                        {country.country} {country.code}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>
              <Col span={18}>
                <div className='aa-form-group'>
                  <Input
                    placeholder={StaticService.placeholder.input}
                    maxLength={schema.phone_number.max}
                    value={data.phone_number}
                    onChange={(e) => onChange('phone_number', e)}
                  />
                </div>
              </Col>
            </Row>
          </Col>
        ) : null}
      </Row>
    )
  }
  const renderHelpCenterDesc = () => {
    return (
      <div className='aa-helpCenter-desc'>
        <p>
          We will try to reach you within <b>2</b> working days. Our team
          members are here for you:
        </p>
        <div className='aa-helpCenter-desc-cs'>
          <img src={CS} alt='' />
          <h4>Demmy</h4>
        </div>
        <div className='aa-helpCenter-desc-cs'>
          <img src={CS} alt='' />
          <h4>Violet</h4>
        </div>
        <div className='aa-helpCenter-desc-cs'>
          <img src={CS} alt='' />
          <h4>Aster</h4>
        </div>
      </div>
    )
  }
  return (
    <>
      <Header />
      <div className='aa-breadcrumb'>
        <Breadcrumb separator='|'>
          <Breadcrumb.Item onClick={() => history.push('/helpCenter')}>
            <Btn feature='link'>Help center</Btn>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <b>Contact us</b>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <article className='aa-page-container aa-page-container-contactUs'>
        <h1 className='aa-title'>Dedicated team, On-time help</h1>
        <Row gutter={20}>
          <Col span={16}>
            {renderContactUsForm()}
            <div className='aa-page-container-footer'>
              <Btn
                disabled={
                  !data.support_type ||
                  !data.subject ||
                  !data.description ||
                  (data.prefered_way_of_contact.includes('Phone number') &&
                    (!data.contry_code || !data.phone_number)) ||
                  (data.support_type === 'Operation questions' &&
                    (!data.product ||
                      !data.issue_happen_time ||
                      !data.frequency)) ||
                  data.prefered_way_of_contact.length === 0
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
          <Col span={8} className='aa-text-right'>
            {renderHelpCenterDesc()}
          </Col>
        </Row>
      </article>
      <Footer />
    </>
  )
}
export default ContactUs

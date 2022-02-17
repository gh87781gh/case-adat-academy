import { useState, useEffect, useContext } from 'react'
import moment from 'moment'
import { MyContext, StaticService } from 'storage'
import GlobalApi from 'api/GlobalApi'
import PurchaseApi from 'api/admin/PurchaseApi'

import schema from 'utility/validate'
import {
  DatePicker,
  Row,
  Col,
  Button,
  Input,
  Select,
  Modal,
  InputNumber
} from 'antd'
const { Option } = Select
const { RangePicker } = DatePicker
const { TextArea } = Input

interface IProps {
  mode: string // CREATE, UPDATE
  isShow: boolean
  onCancel: () => void
  getList: () => void
  getPurchaseDetail?: () => void // only UPDATE
  purchaseDetail?: any // only UPDATE
}
interface IState {
  purchase_number: string
  status: string
  company: string
  course_access: string[]
  quata: number
  duration_start: string
  duration_end: string
  remark: string
}

const ModalCreate = (props: IProps) => {
  const context = useContext(MyContext)
  const api = new PurchaseApi()
  const api_global = new GlobalApi()

  // option
  const [companyOption, setCompanyOption] = useState<any>([])
  const [courseAccessOption, setCourseAccessOption] = useState<any>([])
  useEffect(() => {
    if (props.isShow) {
      api_global
        .getOptions([
          'purchase_management_company',
          'purchase_management_course_access'
        ])
        .then((res: any) => {
          setCompanyOption(res.data[0])
          setCourseAccessOption(res.data[1])
        })
        .finally(() => context.setIsLoading(false))
    }
  }, [props.isShow]) // eslint-disable-line react-hooks/exhaustive-deps

  // data
  const initData = {
    purchase_number: '',
    status: '',
    company: '',
    course_access: [],
    quata: 0,
    duration_start: '',
    duration_end: '',
    remark: ''
  }
  const [data, setData] = useState<IState>({
    ...initData
  })
  const onChange = (key: string, e: any) => {
    const value = e.target.value
    if (value) {
      switch (key) {
        // TODO
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
  const onCount = (key: string, value: number) => {
    setData({ ...data, [key]: value })
  }
  const onPick = (dates: any, dateStrings: any) => {
    if (dateStrings)
      setData({
        ...data,
        duration_start: dateStrings[0],
        duration_end: dateStrings[1]
      })
  }
  const disabledDate = (current: any) => {
    return current < moment().endOf('day')
  }
  useEffect(() => {
    if (props.isShow) {
      // 開啟 modal 時設定初始資料
      // TODO purchaseDetail 改從這裡抓
      setData(
        props.mode === 'CREATE' ? { ...initData } : { ...props.purchaseDetail }
      )
    } else {
      setData({ ...initData })
    }
  }, [props.isShow]) // eslint-disable-line react-hooks/exhaustive-deps

  const submit = () => {
    context.setIsLoading(true)
    api
      .editPurchase(props.mode, data)
      .then(() => {
        if (props.mode === 'UPDATE' && props.getPurchaseDetail)
          props.getPurchaseDetail()

        props.getList()
        props.onCancel()
      })
      .finally(() => context.setIsLoading(false))
  }

  return (
    <Modal
      zIndex={1001}
      className='ad-modal-edit'
      title={
        props.mode === 'CREATE'
          ? 'Create purchase'
          : props.mode === 'UPDATE'
          ? 'Edit purchase'
          : ''
      }
      visible={props.isShow}
      onCancel={props.onCancel}
      width={1100}
      footer={[
        <Button
          key='Create'
          type='primary'
          disabled={
            !data.purchase_number ||
            !data.company ||
            data.course_access.length === 0 ||
            !data.quata ||
            !data.duration_start ||
            !data.duration_end
          }
          onClick={() => submit()}
        >
          {props.mode === 'CREATE'
            ? 'Create'
            : props.mode === 'UPDATE'
            ? 'Save'
            : ''}
        </Button>,
        <Button key='Cancel' onClick={props.onCancel}>
          Cancel
        </Button>
      ]}
    >
      <Row gutter={20}>
        <Col span={props.mode === 'UPDATE' ? 12 : 24}>
          <div className='ad-form-group'>
            <label>Purchase number</label>
            {props.mode === 'CREATE' ? (
              <Input
                placeholder={StaticService.placeholder.input}
                maxLength={schema.purchase_number.max}
                value={data.purchase_number}
                onChange={(e: any) => onChange('purchase_number', e)}
              />
            ) : props.mode === 'UPDATE' ? (
              <div className='ad-form-group-value'>{data.purchase_number}</div>
            ) : null}
          </div>
        </Col>
        {props.mode === 'UPDATE' ? (
          <Col span={12}>
            <div className='ad-form-group'>
              <label>Status</label>
              <div className='ad-form-group-value'>{data.status}</div>
            </div>
          </Col>
        ) : null}
        <Col span={12}>
          <div className='ad-form-group'>
            <label className='required'>Company</label>
            {/* TODO autocompleted */}
            {/* TOCHECK */}
            <Select
              placeholder={StaticService.placeholder.select}
              value={data.company || undefined}
              onChange={(val: any) => onSelect('company', val)}
            >
              {companyOption.map((item: string) => (
                <Option value={item} key={item}>
                  {item}
                </Option>
              ))}
            </Select>
          </div>
        </Col>
        <Col span={12}>
          <div className='ad-form-group'>
            <label className='required'>Duration</label>
            <RangePicker
              value={[
                data.duration_start ? moment(data.duration_start) : null,
                data.duration_end ? moment(data.duration_end) : null
              ]}
              onChange={onPick}
              format={StaticService.format.date}
              disabledDate={disabledDate}
            />
          </div>
        </Col>
        <Col span={12}>
          <div className='ad-form-group'>
            <label className='required'>Course access</label>
            <Select
              mode='multiple'
              value={data.course_access || undefined}
              onChange={(val: any) => onSelect('course_access', val)}
            >
              {/* TOCHECK */}
              {courseAccessOption.map((item: any) => (
                <Option value={item} key={item}>
                  item
                </Option>
              ))}
            </Select>
          </div>
        </Col>
        <Col span={12}>
          <div className='ad-form-group'>
            <label className='required'>Quota</label>
            <InputNumber
              value={data.quata}
              min={
                props.mode === 'UPDATE'
                  ? props.purchaseDetail.usage
                  : schema.quata.min
              }
              max={schema.quata.max}
              onChange={(val: any) => onCount('quata', val)}
            />
          </div>
        </Col>
        {props.mode === 'UPDATE' ? (
          <Col span={24}>
            <div className='ad-form-group'>
              <label>Remarks</label>
              <TextArea
                rows={4}
                value={data.remark}
                onChange={(e) => onChange('remark', e)}
              />
            </div>
          </Col>
        ) : null}
      </Row>
    </Modal>
  )
}
export default ModalCreate

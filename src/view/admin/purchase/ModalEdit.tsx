import { useState, useEffect, useContext } from 'react'
import moment from 'moment'
import { MyContext, StaticService } from 'storage'
import GlobalApi from 'api/GlobalApi'
import PurchaseApi from 'api/admin/PurchaseApi'

import schema from 'utility/validate'
import { DisabledMoment } from 'utility/moment'
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
  purchaseId?: string // only UPDATE
  isModalEditShow?: boolean // only UPDATE
}
interface IState {
  purchase_number: string
  status: string
  company: string[]
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
    company: [],
    course_access: [],
    quata: 1, // 最少是 1
    duration_start: '',
    duration_end: '',
    remark: ''
  }
  const [data, setData] = useState<IState>({
    ...initData
  })
  const onChange = (key: string, e: any) => {
    let value = e.target.value
    if (value) {
      switch (key) {
        case 'purchase_number':
          if (schema.purchase_number.validateStr(value)) return false
          value = value.toLowerCase()
          break
      }
    }
    setData({ ...data, [key]: value })
  }
  const onSelect = (key: string, value: any) => {
    setData({ ...data, [key]: value })
  }
  const onAutoCompleteSelect = (key: string, value: any) => {
    if (value.length > 1) {
      value.shift()
    }
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

  // init data
  useEffect(() => {
    if (props.isShow) {
      if (props.mode === 'CREATE') {
        setData({ ...initData })
      } else if (props.mode === 'UPDATE' && props.purchaseId) {
        context.setIsLoading(true)
        api
          .getPurchaseDetail(props.purchaseId)
          .then((res: any) => setData(res.data))
          .finally(() => context.setIsLoading(false))
      }
    } else {
      setData({ ...initData })
    }
  }, [props.isShow]) // eslint-disable-line react-hooks/exhaustive-deps

  // api
  const submit = () => {
    context.setIsLoading(true)
    api
      .createPurchase(data)
      .then(() => {
        props.getList()
        props.onCancel()
      })
      .finally(() => context.setIsLoading(false))
  }
  const update = () => {
    context.setIsLoading(true)
    api
      .updatePurchase(data)
      .then(() => {
        if (props.getPurchaseDetail) props.getPurchaseDetail()
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
            !data.quata ||
            !data.duration_start ||
            !data.duration_end
          }
          onClick={() =>
            props.mode === 'CREATE'
              ? submit()
              : props.mode === 'UPDATE'
              ? update()
              : null
          }
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
        {props.mode === 'CREATE' ? (
          <Col span={24}>
            <div className='ad-form-group'>
              <label className='required'>Purchase number</label>
              <Input
                placeholder={StaticService.placeholder.input}
                maxLength={schema.purchase_number.max}
                value={data.purchase_number}
                onChange={(e: any) => onChange('purchase_number', e)}
              />
            </div>
          </Col>
        ) : props.mode === 'UPDATE' ? (
          <>
            <Col span={12}>
              <div className='ad-form-group'>
                <label>Purchase number</label>
                <div className='ad-form-group-value'>
                  {data.purchase_number}
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className='ad-form-group'>
                <label>Status</label>
                <div className='ad-form-group-value'>{data.status}</div>
              </div>
            </Col>
          </>
        ) : null}

        <Col span={12}>
          <div className='ad-form-group'>
            <label className='required'>Company</label>
            <Select
              mode='tags'
              placeholder={StaticService.placeholder.select}
              value={data.company || undefined}
              onChange={(val: any) => onAutoCompleteSelect('company', val)}
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
              disabledDate={(current: any) =>
                DisabledMoment('isAfterToday', current)
              }
            />
          </div>
        </Col>
        <Col span={12}>
          <div className='ad-form-group'>
            <label className={props.mode === 'EDIT' ? 'required' : ''}>
              Course access (multiple choice)
            </label>
            <Select
              mode='multiple'
              placeholder={StaticService.placeholder.select}
              value={data.course_access || undefined}
              onChange={(val: any) => onSelect('course_access', val)}
            >
              {courseAccessOption.map((item: any) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
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
              min={schema.quata.min}
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
                placeholder={StaticService.placeholder.input}
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

import { useState, useEffect, useContext } from 'react'
import moment from 'moment'
import { MyContext } from '../../../storage'
import PurchaseApi from '../../../api/PurchaseApi'
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
  getPurchaseList: () => void
  getPurchaseDetail?: () => void //only UPDATE
  purchaseDetail?: any //only UPDATE
}
interface IState {
  purchase_number: string
  status: string
  company: string
  course_access: string[] | any //TOCHECK api有這欄位後 any要拿掉
  quata: number
  duration_start: any
  duration_end: any
  remark: string
}

const ModalEdit = (props: IProps) => {
  const context = useContext(MyContext)
  const api = new PurchaseApi()

  const initData = {
    purchase_number: '',
    status: '',
    company: '',
    course_access: [],
    quata: 0,
    duration_start: null,
    duration_end: null,
    remark: ''
  }
  const [data, setData] = useState<IState>({
    ...initData
  })
  useEffect(() => {
    if (props.isShow)
      setData(
        props.mode === 'CREATE' ? { ...initData } : { ...props.purchaseDetail }
      )
  }, [props.isShow]) // eslint-disable-line react-hooks/exhaustive-deps

  const onSelect = (key: string, value: any) => {
    setData({ ...data, [key]: value })
  }
  const onChange = (key: string, e: any) => {
    const value = e.target.value
    // if (value) {
    //   switch (key) {
    //     case 'keyword':
    //       // if (value && ValidateStr('isSymbol', value)) return false
    //       break
    //   }
    // }
    setData({ ...data, [key]: value })
  }
  const onCount = (key: string, value: number) => {
    setData({ ...data, [key]: value })
  }
  const onPick = (dates: any[] | null) => {
    if (dates)
      setData({
        ...data,
        duration_start: dates[0],
        duration_end: dates[1]
      })
  }
  const disabledDate = (current: any) => current < moment().endOf('day')

  const submit = () => {
    context.setIsLoading(true)
    api
      .editPurchase(props.mode, data)
      .then(() => {
        if (props.mode === 'UPDATE' && props.getPurchaseDetail)
          props.getPurchaseDetail()

        props.getPurchaseList()
        props.onCancel()
      })
      .catch()
      .finally(() => {
        context.setIsLoading(false)
      })
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
            !data.course_access || //TOCHECK 後端目前沒這個欄位
            !data.quata ||
            !data.duration_start ||
            !data.duration_end
          }
          onClick={() => submit()}
        >
          Create
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
                placeholder='Clear hint for the input'
                maxLength={50}
                value={data.purchase_number}
                onChange={(e) => onChange('purchase_number', e)}
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
            <Select
              value={data.company}
              placeholder='Please select'
              onChange={(val) => onSelect('company', val)}
            >
              <Option value={'company_a'}>Company A</Option>
              <Option value={'company_b'}>Company B</Option>
              {/* TODO */}
              {/* {optionIndustry.map((item: any) => (
                  <Option value={item.value} key={item.value}>
                    {item.name}
                  </Option>
                ))} */}
            </Select>
          </div>
        </Col>
        <Col span={12}>
          <div className='ad-form-group'>
            <label className='required'>Duration</label>
            <RangePicker
              value={[data.duration_start, data.duration_end]}
              onChange={onPick}
              format='YYYY/MM/DD'
              disabledDate={disabledDate}
            />
          </div>
        </Col>
        <Col span={12}>
          <div className='ad-form-group'>
            <label className='required'>Course access</label>
            <Select
              mode='multiple'
              value={data.course_access}
              placeholder='Please select'
              onChange={(val) => onSelect('course_access', val)}
            >
              <Option value={'access_1'}>Access 1</Option>
              <Option value={'access_2'}>Access 2</Option>
              <Option value={'access_3'}>Access 3</Option>
              <Option value={'access_4'}>Access 4</Option>
              <Option value={'access_5'}>Access 5</Option>
              {/* TODO */}
              {/* {optionIndustry.map((item: any) => (
                  <Option value={item.value} key={item.value}>
                    {item.name}
                  </Option>
                ))} */}
            </Select>
          </div>
        </Col>
        <Col span={12}>
          <div className='ad-form-group'>
            <label className='required'>Quota</label>
            <InputNumber
              value={data.quata}
              min={props.mode === 'UPDATE' ? props.purchaseDetail.usage : 0}
              max={100}
              onChange={(val) => onCount('quata', val)}
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
export default ModalEdit

import { useState, useContext, useEffect } from 'react'
import { MyContext, StaticService } from 'storage'
import GlobalApi from 'api/GlobalApi'
import AccountApi from 'api/admin/AccountApi'
import PurchaseApi from 'api/admin/PurchaseApi'

import { FormGroupMsg } from 'utility/component'
import schema from 'utility/validate'
import { Row, Col, Button, Input, Select, Modal } from 'antd'
const { Option } = Select

interface IProps {
  isShow: boolean
  onCancel: () => void
  getList: () => void
  purchaseDetail?: any
}
interface IState {
  purchase_id: string
  email: string
}

const ModalCreate = (props: IProps) => {
  const context = useContext(MyContext)
  const api_global = new GlobalApi()
  const api_purchase = new PurchaseApi()
  const api = new AccountApi()

  // option
  const [courseAccessOption, setCourseAccessOption] = useState<any>([])
  useEffect(() => {
    if (props.isShow) {
      api_global
        .getOptions(['purchase_management_course_access'])
        .then((res: any) => setCourseAccessOption(res.data[0]))
        .finally(() => context.setIsLoading(false))
    }
  }, [props.isShow]) // eslint-disable-line react-hooks/exhaustive-deps

  // data
  const initData = {
    purchase_id: '',
    email: ''
  }
  const [data, setData] = useState<IState>({ ...initData })
  const [isEmail, setIsEmail] = useState<boolean | undefined>(undefined)
  const onChange = (key: string, e: any) => {
    const value = e.target.value
    if (value) {
      switch (key) {
        case 'email':
          if (schema.email.validateStr(value)) return false
          setIsEmail(schema.email.validateFormat(value))
          break
      }
    }
    setData({ ...data, [key]: value })
  }
  const onSelect = (key: string, value: any) => {
    if (key === 'purchase_id') {
      setPurchaseDetail(purchaseList.find((item: any) => item.id === value))
    }
    setData({ ...data, [key]: value })
  }

  // purchase detail
  const [purchaseList, setPurchaseList] = useState<any>([])
  const [purchaseDetail, setPurchaseDetail] = useState<any>(null)
  const [formatCourseAccess, setFormatCourseAccess] = useState<string>('')
  useEffect(() => {
    if (purchaseDetail && courseAccessOption) {
      const ary: any = []
      for (const id of purchaseDetail.course_access) {
        for (const option of courseAccessOption) {
          if (id === option.id) {
            ary.push(option.name)
            break
          }
        }
      }
      setFormatCourseAccess(ary.join(', '))
    }
  }, [purchaseDetail, courseAccessOption]) // eslint-disable-line react-hooks/exhaustive-deps

  // init page
  useEffect(() => {
    if (props.isShow) {
      setIsEmail(undefined)

      if (props.purchaseDetail) {
        setPurchaseDetail(props.purchaseDetail)
        setData({ purchase_id: props.purchaseDetail.id, email: '' })
      } else {
        setData({ ...initData })
        setPurchaseDetail(null)
        context.setIsLoading(true)
        api
          .getAccountPurchases()
          .then((res: any) => setPurchaseList(res.data))
          .finally(() => context.setIsLoading(false))
      }
    }
  }, [props.isShow]) // eslint-disable-line react-hooks/exhaustive-deps

  // api
  const createAccount = () => {
    context.setIsLoading(true)

    if (props.purchaseDetail) {
      api_purchase
        .createPurchaseAccount(props.purchaseDetail.id, { email: data.email })
        .then(() => {
          props.getList()
          props.onCancel()
        })
        .finally(() => context.setIsLoading(false))
    } else {
      api
        .createAccount(data)
        .then(() => {
          props.getList()
          props.onCancel()
        })
        .finally(() => context.setIsLoading(false))
    }
  }

  return (
    <Modal
      className='aa-modal-edit'
      title='Create account'
      visible={props.isShow}
      onCancel={props.onCancel}
      width={1100}
      footer={[
        <Button
          key='Create'
          type='primary'
          disabled={!data.email || isEmail !== true}
          onClick={() => createAccount()}
        >
          Create
        </Button>,
        <Button key='Cancel' onClick={props.onCancel}>
          Cancel
        </Button>
      ]}
    >
      <Row gutter={20}>
        <Col span={12}>
          <div className='aa-form-group'>
            <label>Purchase number</label>
            {props.purchaseDetail ? (
              <div className='aa-form-group-value'>
                {props.purchaseDetail.purchase_number}
              </div>
            ) : (
              <Select
                value={data.purchase_id}
                placeholder='Please select'
                onChange={(val) => onSelect('purchase_id', val)}
              >
                {purchaseList.map((item: any, index: number) => (
                  <Option value={item.id} key={item.id}>
                    {item.purchase_number}
                  </Option>
                ))}
              </Select>
            )}
          </div>
        </Col>
      </Row>
      <Row gutter={20}>
        <Col span={8}>
          <div className='aa-form-group'>
            <label>Company</label>
            <div className='aa-form-group-value'>
              {purchaseDetail ? `${purchaseDetail.company}` : '-'}
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className='aa-form-group'>
            <label>Status</label>
            <div className='aa-form-group-value'>
              {purchaseDetail ? `${purchaseDetail.status}` : '-'}
            </div>
          </div>
        </Col>
      </Row>
      <Row gutter={20}>
        <Col span={8}>
          <div className='aa-form-group'>
            <label>Course access</label>
            <div className='aa-form-group-value'>
              {/* TODO */}
              {formatCourseAccess || '-'}
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className='aa-form-group'>
            <label>Quota</label>
            <div className='aa-form-group-value'>
              {purchaseDetail
                ? `${purchaseDetail.usage} used/ ${purchaseDetail.quata}`
                : '-'}
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className='aa-form-group'>
            <label>Duration</label>
            <div className='aa-form-group-value'>
              {purchaseDetail
                ? `${purchaseDetail.duration_start}-${purchaseDetail.duration_end}`
                : '-'}
            </div>
          </div>
        </Col>
        {data.purchase_id ? (
          <Col span={10}>
            <div className='aa-form-group'>
              <label className='required'>
                Please input the account’s email
              </label>
              <Input
                placeholder={StaticService.placeholder.input}
                value={data.email}
                maxLength={schema.email.max}
                onChange={(e: any) => onChange('email', e)}
              />
              <FormGroupMsg
                isShow={isEmail === false}
                type='error'
                isShowIcon={true}
                msg={schema.email.errFormat}
              />
            </div>
          </Col>
        ) : null}
      </Row>
    </Modal>
  )
}
export default ModalCreate

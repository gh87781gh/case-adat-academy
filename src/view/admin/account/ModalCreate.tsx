import { useState, useContext, useEffect } from 'react'
import moment from 'moment'
import { MyContext } from '../../../storage'
import AccountApi from '../../../api/AccountApi'
import FormGroupMsg from '../../../utility/component/FormGroupMsg'
import { ValidateStr } from '../../../utility/validate'
import { Row, Col, Button, Input, Select, Modal } from 'antd'
const { Option } = Select

interface IProps {
  isShow: boolean
  onCancel: () => void
  getAccounts: () => void
}
interface IState {
  purchase_id: string
  email: string
}

const ModalCreate = (props: IProps) => {
  const api = new AccountApi()
  const context = useContext(MyContext)

  const [isEmail, setIsEmail] = useState<boolean | undefined>(undefined)
  const initData = {
    purchase_id: '',
    email: ''
  }
  const [data, setData] = useState<IState>({ ...initData })
  const onSelect = (key: string, value: any) => {
    if (key === 'purchase_id') {
      setPurchaseDetail(purchaseList.find((item: any) => item.id === value))
    }
    setData({ ...data, [key]: value })
  }
  const onChange = (key: string, e: any) => {
    const value = e.target.value
    if (value) {
      switch (key) {
        case 'email':
          if (value && !ValidateStr('isUserName', value)) return false
          setIsEmail(ValidateStr('isEmail', value))
          break
      }
    }
    setData({ ...data, [key]: value })
  }

  const [purchaseList, setPurchaseList] = useState<any>([])
  const [purchaseDetail, setPurchaseDetail] = useState<any>(null)
  useEffect(() => {
    if (props.isShow) {
      setData({ ...initData })
      setPurchaseDetail(null)
      context.setIsLoading(true)
      api
        .getUserPurchases()
        .then((res: any) => {
          setPurchaseList(res)
        })
        .catch()
        .finally(() => {
          context.setIsLoading(false)
        })
    }
  }, [props.isShow])

  const createAccount = () => {
    context.setIsLoading(true)
    api
      .createAccount(data)
      .then(() => {
        props.getAccounts()
        props.onCancel()
      })
      .catch()
      .finally(() => {
        context.setIsLoading(false)
      })
  }

  // TODO are u sure popup

  return (
    <Modal
      className='ad-modal-edit'
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
          <div className='ad-form-group'>
            <label className='required'>Purchase number</label>
            <Select
              value={data.purchase_id}
              placeholder='Please select'
              onChange={(val) => onSelect('purchase_id', val)}
            >
              {/* TODO */}
              {purchaseList.map((item: any, index: number) => (
                <Option value={item.id} key={item.id}>
                  {item.purchase_number}
                </Option>
              ))}
            </Select>
          </div>
        </Col>
      </Row>
      <Row gutter={20}>
        <Col span={8}>
          <div className='ad-form-group'>
            <label>Company</label>
            <div className='ad-form-group-value'>
              {purchaseDetail ? `${purchaseDetail.company}` : '-'}
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className='ad-form-group'>
            <label>Status</label>
            <div className='ad-form-group-value'>
              {purchaseDetail ? `${purchaseDetail.status}` : '-'}
            </div>
          </div>
        </Col>
      </Row>
      <Row gutter={20}>
        <Col span={8}>
          <div className='ad-form-group'>
            <label>Course access</label>
            <div className='ad-form-group-value'>
              {/* TODO  map*/}
              {purchaseDetail ? `${purchaseDetail.course_access}` : '-'}
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className='ad-form-group'>
            <label>Quota</label>
            <div className='ad-form-group-value'>
              {purchaseDetail
                ? `${purchaseDetail.usage} used/ ${purchaseDetail.quata}`
                : '-'}
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className='ad-form-group'>
            <label>Duration</label>
            <div className='ad-form-group-value'>
              {purchaseDetail
                ? `${moment(purchaseDetail.duration_start).format(
                    'YYYY/MM/DD'
                  )}-${moment(purchaseDetail.duration_end).format(
                    'YYYY/MM/DD'
                  )}`
                : '-'}
            </div>
          </div>
        </Col>
        {data.purchase_id ? (
          <Col span={10}>
            <div className='ad-form-group'>
              <label className='required'>
                Please input the account’s email
              </label>
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
            </div>
          </Col>
        ) : null}
      </Row>
    </Modal>
  )
}
export default ModalCreate

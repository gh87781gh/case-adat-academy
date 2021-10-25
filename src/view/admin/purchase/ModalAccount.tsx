import { useState, useContext } from 'react'
import moment from 'moment'
import { MyContext } from '../../../storage'
import PurchaseApi from '../../../api/PurchaseApi'
import FormGroupMsg from '../../../utility/component/FormGroupMsg'
import { ValidateStr } from '../../../utility/validate'
import { Row, Col, Button, Input, Modal } from 'antd'

interface IProps {
  isShow: boolean
  onCancel: () => void
  purchaseDetail: any
}
interface IState {
  email: string
}

const ModalAccount = (props: IProps) => {
  const api = new PurchaseApi()
  const context = useContext(MyContext)

  const [isEmail, setIsEmail] = useState<boolean | undefined>(undefined)
  const [data, setData] = useState<IState>({
    email: ''
  })
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

  const addAccount = () => {
    context.setIsLoading(true)
    api
      .addPurchaseAccount(props.purchaseDetail.id, data)
      .then(() => {})
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
          onClick={() => addAccount()}
        >
          Create
        </Button>,
        <Button key='Cancel' onClick={props.onCancel}>
          Cancel
        </Button>
      ]}
    >
      <Row gutter={20}>
        <Col span={24}>
          <div className='ad-form-group'>
            <label>Purchase number</label>
            <div className='ad-form-group-value'>
              {props.purchaseDetail.purchase_number}
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className='ad-form-group'>
            <label>Company</label>
            <div className='ad-form-group-value'>
              {props.purchaseDetail.company}
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className='ad-form-group'>
            <label>Status</label>
            <div className='ad-form-group-value'>
              {props.purchaseDetail.status}
            </div>
          </div>
        </Col>
      </Row>
      <Row gutter={20}>
        <Col span={8}>
          <div className='ad-form-group'>
            <label>Course access</label>
            <div className='ad-form-group-value'>
              {props.purchaseDetail.course_access}
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className='ad-form-group'>
            <label>Quota</label>
            <div className='ad-form-group-value'>
              {props.purchaseDetail.usage} used/ {props.purchaseDetail.quata}
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className='ad-form-group'>
            <label>Duration</label>
            <div className='ad-form-group-value'>
              {moment(props.purchaseDetail.duration_start).format('YYYY/MM/DD')}{' '}
              - {moment(props.purchaseDetail.duration_end).format('YYYY/MM/DD')}
            </div>
          </div>
        </Col>
        <Col span={10}>
          <div className='ad-form-group'>
            <label className='required'>Please input the account’s email</label>
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
      </Row>
    </Modal>
  )
}
export default ModalAccount

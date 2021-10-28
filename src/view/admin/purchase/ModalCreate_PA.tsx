import { useState, useContext, useEffect } from 'react'
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

const ModalCreate_PA = (props: IProps) => {
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
  useEffect(() => {
    setData({ email: '' })
    setIsEmail(undefined)
  }, [props.isShow]) // eslint-disable-line react-hooks/exhaustive-deps

  const editAccount = () => {
    context.setIsLoading(true)
    api
      .editPurchaseAccount(props.purchaseDetail.id, data)
      .then(() => {})
      .catch()
      .finally(() => {
        context.setIsLoading(false)
      })
  }

  const [isModalConfirmShow, setIsModalConfirmShow] = useState(false)
  const renderConfirmModal = () => (
    <Modal
      title='Are you sure?'
      visible={isModalConfirmShow}
      onCancel={() => setIsModalConfirmShow(false)}
      footer={[
        <Button
          key='Create'
          type='primary'
          // onClick={() => deletePurchase()}
        >
          Yes. Move it.
        </Button>,
        <Button key='Cancel' onClick={props.onCancel}>
          No
        </Button>
      ]}
      width={720}
    >
      “Leoo123@winbond.com” is in user ID “Leoo123”. Are you sure you want to
      move the account to “winbond123”?
    </Modal>
  )

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
          onClick={() => editAccount()}
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
              {/* TOCHECK */}
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
              {props.purchaseDetail.duration_start} -{' '}
              {props.purchaseDetail.duration_end}
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
export default ModalCreate_PA

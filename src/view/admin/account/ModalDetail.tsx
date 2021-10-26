import { useState, useContext } from 'react'
import moment from 'moment'
import { MyContext } from '../../../storage'
import AccountApi from '../../../api/AccountApi'
import ModalRecord from './ModalRecord'
import { Row, Col, Button, Modal } from 'antd'

interface IProps {
  isShow: boolean
  onCancel: () => void
  accountDetail: any
  getAccountList: () => void
  showEditModal: () => void
}

const ModalDetail = (props: IProps) => {
  const api = new AccountApi()
  const context = useContext(MyContext)

  const [isModalRecordShow, setIsModalRecordShow] = useState(false)
  const [isModalConfirmShow, setIsModalConfirmShow] = useState(false)

  const disable = () => {
    context.setIsLoading(true)
    api
      .deleteAccount(props.accountDetail.id)
      .then(() => {
        props.getAccountList()
        props.onCancel()
      })
      .catch()
      .finally(() => {
        context.setIsLoading(false)
      })
  }

  const renderConfirmModal = () => (
    <Modal
      title='Are you sure?'
      visible={isModalConfirmShow}
      onCancel={() => setIsModalConfirmShow(false)}
      footer={[
        <Button
          key='Create'
          type='primary'
          onClick={() => {
            setIsModalConfirmShow(false)
            disable()
          }}
        >
          Yes. Disable it.
        </Button>,
        <Button key='Cancel' onClick={props.onCancel}>
          No
        </Button>
      ]}
      width={720}
    >
      “{props.accountDetail.user_id}” is now under the purchase number “
      {props.accountDetail.purchase_number}”. Are you sure you want to disable
      the account’s course access?
    </Modal>
  )

  const data = props.accountDetail
  return (
    <>
      <Modal
        className='ad-modal-info'
        title={
          <>
            Account details
            <div className='ad-btn-group ad-float-right'>
              <Button key='Edit' type='primary' onClick={props.showEditModal}>
                Edit
              </Button>
              <Button
                key='View'
                onClick={() => {
                  setIsModalRecordShow(true)
                }}
              >
                View records
              </Button>
              <Button
                key='Disable'
                onClick={() =>
                  props.accountDetail.purchase_number
                    ? setIsModalConfirmShow(true)
                    : disable()
                }
              >
                Disable
              </Button>
            </div>
          </>
        }
        visible={props.isShow}
        onCancel={props.onCancel}
        width={1100}
        footer={null}
      >
        <Row gutter={20}>
          <Col span={12}>
            <div className='ad-form-group ad-form-group-horizontal'>
              <label>Purchase number</label>
              {data.purchase_number ? (
                <>
                  <div className='ad-form-group-value'>
                    {data.purchase_number}
                  </div>
                  <Button type='link'>open purchase</Button>
                </>
              ) : null}
            </div>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={6}>
            <div className='ad-form-group'>
              <label>Use ID</label>
              <div className='ad-form-group-value'>{data.user_id}</div>
            </div>
          </Col>
          <Col span={6}>
            <div className='ad-form-group'>
              <label>Current email</label>
              <div className='ad-form-group-value'>{data.email}</div>
            </div>
          </Col>
          <Col span={6}>
            <div className='ad-form-group'>
              <label>Current status</label>
              <div className='ad-form-group-value'>{data.status}</div>
            </div>
          </Col>
        </Row>
      </Modal>
      {renderConfirmModal()}
    </>
  )
}
export default ModalDetail

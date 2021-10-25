import { useState, useContext } from 'react'
import moment from 'moment'
import { MyContext } from '../../../storage'
import PurchaseApi from '../../../api/PurchaseApi'
import ModalRecord from './ModalRecord'
import { Row, Col, Button, Modal } from 'antd'

interface IProps {
  isShow: boolean
  onCancel: () => void
  showEditModal: () => void
  getList: () => void
  purchaseDetail: any
}

const ModalDetail = (props: IProps) => {
  const api = new PurchaseApi()
  const context = useContext(MyContext)

  const [isModalRecordShow, setIsModalRecordShow] = useState(false)
  const [isModalConfirmShow, setIsModalConfirmShow] = useState(false)

  const deletePurchase = () => {
    context.setIsLoading(true)
    api
      .deletePurchase(props.purchaseDetail.id)
      .then(() => {
        props.getList()
        props.onCancel()
      })
      .catch()
      .finally(() => {
        setIsModalConfirmShow(false)
        context.setIsLoading(false)
      })
  }

  const renderConfirmModal = () => (
    <Modal
      title='Are you sure?'
      visible={isModalConfirmShow}
      onCancel={() => setIsModalConfirmShow(false)}
      footer={[
        <Button key='Create' type='primary' onClick={() => deletePurchase()}>
          Yes. Delete it.
        </Button>,
        <Button key='Cancel' onClick={props.onCancel}>
          No
        </Button>
      ]}
      width={720}
    >
      Are you sure you want to delete the purchase, which has enabled{' '}
      {props.purchaseDetail.purchase_accounts?.length} users?
    </Modal>
  )

  const data = props.purchaseDetail
  return (
    <>
      <Modal
        className='ad-modal-info'
        title={
          <>
            Purchase details
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
              <Button key='Delete' onClick={() => setIsModalConfirmShow(true)}>
                Delete
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
            <div className='ad-form-group'>
              <label>Purchase number</label>
              <div className='ad-form-group-value'>{data.purchase_number}</div>
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label>Status</label>
              <div className='ad-form-group-value'>{data.status}</div>
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label>Company</label>
              <div className='ad-form-group-value'>{data.company}</div>
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label>Duration</label>
              <div className='ad-form-group-value'>
                {moment(data.duration_start).format('YYYY/MM/DD')} -{' '}
                {moment(data.duration_end).format('YYYY/MM/DD')}
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label>Course access</label>
              {/* TODO array.map render */}
              <div className='ad-form-group-value'>{data.course_access}</div>
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label>Quota</label>
              <div className='ad-form-group-value'>
                {data.purchase_accounts?.length} used/ {data.quata}
              </div>
            </div>
          </Col>
        </Row>
      </Modal>
      <ModalRecord
        isShow={isModalRecordShow}
        onCancel={() => setIsModalRecordShow(false)}
      />
      {renderConfirmModal()}
    </>
  )
}
export default ModalDetail

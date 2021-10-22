import { useState } from 'react'
import ModalRecord from './ModalRecord'
import { Row, Col, Button, Modal } from 'antd'

interface IProps {
  isShow: boolean
  data: any
  onCancel: () => void
  showCreateModal: () => void
}

const ModalDetail = (props: IProps) => {
  const [isModalRecordShow, setIsModalRecordShow] = useState(false)
  const [isModalConfirmShow, setIsModalConfirmShow] = useState(false)
  const [recordNumber, setRecordNumber] = useState('')

  const renderConfirmModal = () => (
    <Modal
      title='Are you sure?'
      visible={isModalConfirmShow}
      onCancel={() => setIsModalConfirmShow(false)}
      footer={[
        <Button
          key='Create'
          type='primary'
          onClick={() => console.log('Create!')}
        >
          Yes. Delete it.
        </Button>,
        <Button key='Cancel' onClick={props.onCancel}>
          No
        </Button>
      ]}
      width={720}
    >
      Are you sure you want to delete the purchase, which has enabled 3 users?
    </Modal>
  )

  return (
    <>
      <Modal
        className='ad-modal-info'
        title={
          <>
            Purchase details
            <div className='ad-btn-group ad-float-right'>
              <Button key='Edit' type='primary' onClick={props.showCreateModal}>
                Edit
              </Button>
              <Button
                key='View'
                onClick={() => {
                  setRecordNumber('')
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
              <div className='ad-form-group-value'>
                {props.data.purchase_number}
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label>Status</label>
              <div className='ad-form-group-value'>
                {props.data.purchase_number}
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label>Company</label>
              <div className='ad-form-group-value'>{props.data.company}</div>
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label>Duration</label>
              <div className='ad-form-group-value'>
                {props.data.duration_start} - {props.data.duration_end}
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label>Course access</label>
              <div className='ad-form-group-value'>{props.data.access}</div>
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label>Quota</label>
              <div className='ad-form-group-value'>{props.data.quata}</div>
            </div>
          </Col>
        </Row>
      </Modal>
      <ModalRecord
        isShow={isModalRecordShow}
        recordNumber={recordNumber}
        onCancel={() => setIsModalRecordShow(false)}
      />
      {renderConfirmModal()}
    </>
  )
}
export default ModalDetail

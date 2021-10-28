import { useState, useContext, useEffect } from 'react'
import moment from 'moment'
import { MyContext } from '../../../storage'
import PurchaseApi from '../../../api/PurchaseApi'
import ModalEdit from './ModalEdit'
import { Row, Col, Button, Modal } from 'antd'

interface IProps {
  isShow: boolean
  onCancel: () => void
  getPurchaseList: () => void
  purchaseId: string
  showModalRecord: () => void
}

const ModalDetail = (props: IProps) => {
  const api = new PurchaseApi()
  const context = useContext(MyContext)

  const [isModalEditShow, setIsModalEditShow] = useState(false)
  const [isModalConfirmShow, setIsModalConfirmShow] = useState(false)

  const [purchaseDetail, setPurchaseDetail] = useState<any>({})
  const getPurchaseDetail = () => {
    context.setIsLoading(true)
    api
      .getPurchaseDetail(props.purchaseId)
      .then((res: any) => setPurchaseDetail(res))
      .catch()
      .finally(() => {
        context.setIsLoading(false)
      })
  }
  useEffect(() => {
    if (props.isShow && props.purchaseId) getPurchaseDetail()
  }, [props.isShow]) // eslint-disable-line react-hooks/exhaustive-deps

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
      {purchaseDetail.usage} users?
    </Modal>
  )
  const deletePurchase = () => {
    context.setIsLoading(true)
    api
      .deletePurchase(props.purchaseId)
      .then(() => {
        props.getPurchaseList()
        props.onCancel()
      })
      .catch()
      .finally(() => {
        setIsModalConfirmShow(false)
        context.setIsLoading(false)
      })
  }

  return (
    <>
      <Modal
        className='ad-modal-info'
        title={
          <>
            Purchase details
            <div className='ad-btn-group ad-float-right'>
              <Button
                key='Edit'
                type='primary'
                onClick={() => setIsModalEditShow(true)}
              >
                Edit
              </Button>
              <Button key='View' onClick={props.showModalRecord}>
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
                {purchaseDetail.purchase_number}
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label>Status</label>
              <div className='ad-form-group-value'>{purchaseDetail.status}</div>
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label>Company</label>
              <div className='ad-form-group-value'>
                {purchaseDetail.company}
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label>Duration</label>
              <div className='ad-form-group-value'>
                {moment(purchaseDetail.duration_start).format('YYYY/MM/DD')} -{' '}
                {moment(purchaseDetail.duration_end).format('YYYY/MM/DD')}
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label>Course access</label>
              <div className='ad-form-group-value'>
                {purchaseDetail.course_access}
                {/* TOCHECK array.map render */}
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label>Quota</label>
              <div className='ad-form-group-value'>
                {purchaseDetail.usage} used/ {purchaseDetail.quata}
              </div>
            </div>
          </Col>
        </Row>
      </Modal>
      <ModalEdit
        mode='UPDATE'
        isShow={isModalEditShow}
        onCancel={() => setIsModalEditShow(false)}
        getPurchaseList={() => props.getPurchaseList()}
        getPurchaseDetail={() => getPurchaseDetail()}
        purchaseDetail={purchaseDetail}
      />
      {renderConfirmModal()}
    </>
  )
}
export default ModalDetail

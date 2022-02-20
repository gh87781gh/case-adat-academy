import { useState, useContext, useEffect } from 'react'
import { MyContext } from 'storage'

import PurchaseApi from 'api/admin/PurchaseApi'

import { Row, Col, Button, Modal } from 'antd'

interface IProps {
  isShow: boolean
  onCancel: () => void
  getList: (keepPage?: boolean) => void
  purchaseId: string
  isModalEditShow: boolean
  setIsModalEditShow: (isShow: boolean) => void
  setIsModalRecordShow: (isShow: boolean) => void
}

const ModalDetail = (props: IProps) => {
  const api = new PurchaseApi()
  const context = useContext(MyContext)

  // init purchase detail
  const [purchaseDetail, setPurchaseDetail] = useState<any>({})
  const getPurchaseDetail = () => {
    context.setIsLoading(true)
    api
      .getPurchaseDetail(props.purchaseId)
      .then((res: any) => setPurchaseDetail(res.data))
      .finally(() => context.setIsLoading(false))
  }
  useEffect(() => {
    if (props.isShow && (props.purchaseId || !props.isModalEditShow))
      getPurchaseDetail()
  }, [props.isShow, props.isModalEditShow]) // eslint-disable-line react-hooks/exhaustive-deps

  // delete
  const [isModalConfirmShow, setIsModalConfirmShow] = useState<boolean>(false)
  const renderConfirmModal = () => (
    <Modal
      title='Are you sure?'
      visible={isModalConfirmShow}
      onCancel={() => setIsModalConfirmShow(false)}
      footer={[
        <Button key='Create' type='primary' onClick={deletePurchase}>
          Yes. Delete it.
        </Button>,
        <Button key='Cancel' onClick={() => setIsModalConfirmShow(false)}>
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
        props.getList()
        props.onCancel()
      })
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
                onClick={() => props.setIsModalEditShow(true)}
              >
                Edit
              </Button>
              <Button
                key='View'
                onClick={() => props.setIsModalRecordShow(true)}
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
                {purchaseDetail.duration_start} - {purchaseDetail.duration_end}
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className='ad-form-group'>
              <label>Course access</label>
              <div className='ad-form-group-value'>
                {purchaseDetail.course_access}
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
      {renderConfirmModal()}
    </>
  )
}
export default ModalDetail

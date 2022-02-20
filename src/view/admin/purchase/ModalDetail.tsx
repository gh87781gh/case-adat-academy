import { useState, useContext, useEffect } from 'react'
import { MyContext } from 'storage'

import PurchaseApi from 'api/admin/PurchaseApi'

import { Btn } from 'utility/component'
import { Row, Col, Modal } from 'antd'

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
        <Btn key='Create' feature='action' onClick={deletePurchase}>
          Yes. Delete it.
        </Btn>,
        <Btn
          key='Cancel'
          feature='primary'
          onClick={() => setIsModalConfirmShow(false)}
        >
          No
        </Btn>
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
              <Btn
                key='Edit'
                feature='action'
                onClick={() => props.setIsModalEditShow(true)}
              >
                Edit
              </Btn>
              <Btn
                key='View'
                feature='primary'
                onClick={() => props.setIsModalRecordShow(true)}
              >
                View records
              </Btn>
              <Btn
                key='Delete'
                feature='primary'
                onClick={() => setIsModalConfirmShow(true)}
              >
                Delete
              </Btn>
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

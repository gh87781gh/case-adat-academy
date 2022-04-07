import { useState, useContext, useEffect } from 'react'
import { MyContext } from 'storage'
import GlobalApi from 'api/GlobalApi'
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
  const context = useContext(MyContext)
  const api = new PurchaseApi()
  const api_global = new GlobalApi()

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

  // init purchase detail
  const [purchaseDetail, setPurchaseDetail] = useState<any>({})
  const [courseAccessNameList, setCourseAccessNameList] = useState<any>('')
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
  useEffect(() => {
    const ary: any = courseAccessOption.filter((item: any) => {
      return purchaseDetail.course_access.includes(item.id)
    })
    const nameList = ary.map((item: any) => item.name)
    setCourseAccessNameList(nameList.join(', ') ?? '')
  }, [purchaseDetail]) // eslint-disable-line react-hooks/exhaustive-deps

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
        className='aa-modal-info'
        title={
          <>
            Purchase details
            <div className='aa-btn-group aa-float-right'>
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
            <div className='aa-form-group'>
              <label>Purchase number</label>
              <div className='aa-form-group-value'>
                {purchaseDetail.purchase_number}
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className='aa-form-group'>
              <label>Status</label>
              <div className='aa-form-group-value'>{purchaseDetail.status}</div>
            </div>
          </Col>
          <Col span={12}>
            <div className='aa-form-group'>
              <label>Company</label>
              <div className='aa-form-group-value'>
                {purchaseDetail.company}
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className='aa-form-group'>
              <label>Duration</label>
              <div className='aa-form-group-value'>
                {purchaseDetail.duration_start} - {purchaseDetail.duration_end}
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className='aa-form-group'>
              <label>Course access</label>
              <div className='aa-form-group-value'>{courseAccessNameList}</div>
            </div>
          </Col>
          <Col span={12}>
            <div className='aa-form-group'>
              <label>Quota</label>
              <div className='aa-form-group-value'>
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

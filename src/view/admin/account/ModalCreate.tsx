import { useState, useContext, useEffect } from 'react'
import { MyContext } from 'storage'
import AccountApi from 'api/AccountApi'
import PurchaseApi from 'api/PurchaseApi'
import FormGroupMsg from 'utility/component/FormGroupMsg'
import { ValidateStr } from 'utility/validate'
import { Row, Col, Button, Input, Select, Modal } from 'antd'
const { Option } = Select

interface IProps {
  isShow: boolean
  onCancel: () => void
  getList: () => void
  purchaseDetail?: any
}
interface IState {
  purchase_id: string
  email: string
}

const ModalCreate = (props: IProps) => {
  const context = useContext(MyContext)
  const api = new AccountApi()
  const api_purchase = new PurchaseApi()

  const [isEmail, setIsEmail] = useState<boolean | undefined>(undefined)
  const initData = {
    purchase_id: '',
    email: ''
  }
  const [data, setData] = useState<IState>({ ...initData })
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
  const onSelect = (key: string, value: any) => {
    if (key === 'purchase_id') {
      setPurchaseDetail(purchaseList.find((item: any) => item.id === value))
    }
    setData({ ...data, [key]: value })
  }

  const [purchaseList, setPurchaseList] = useState<any>([])
  const [purchaseDetail, setPurchaseDetail] = useState<any>(null)
  useEffect(() => {
    if (props.isShow) {
      setIsEmail(undefined)

      if (props.purchaseDetail) {
        setPurchaseDetail(props.purchaseDetail)
        setData({ purchase_id: props.purchaseDetail.id, email: '' })
      } else {
        setData({ ...initData })
        setPurchaseDetail(null)
        context.setIsLoading(true)
        api
          .getAccountPurchases()
          .then((res: any) => setPurchaseList(res))
          .finally(() => context.setIsLoading(false))
      }
    }
  }, [props.isShow]) // eslint-disable-line react-hooks/exhaustive-deps

  const createAccount = () => {
    context.setIsLoading(true)

    if (props.purchaseDetail) {
      api_purchase
        .createPurchaseAccount(props.purchaseDetail.id, { email: data.email })
        .then(() => {
          props.getList()
          props.onCancel()
        })
        .finally(() => context.setIsLoading(false))
    } else {
      api
        .createAccount(data)
        .then(() => {
          props.getList()
          props.onCancel()
        })
        .finally(() => context.setIsLoading(false))
    }
  }

  // TOCHECK are u sure popup
  // const [isModalConfirmShow, setIsModalConfirmShow] = useState<boolean>(false)
  // const renderConfirmModal = () => (
  //   <Modal
  //     title='Are you sure?'
  //     visible={isModalConfirmShow}
  //     onCancel={() => setIsModalConfirmShow(false)}
  //     footer={[
  //       <Button
  //         key='Create'
  //         type='primary'
  //         // onClick={() => deletePurchase()}
  //       >
  //         Yes. Move it.
  //       </Button>,
  //       <Button key='Cancel' onClick={props.onCancel}>
  //         No
  //       </Button>
  //     ]}
  //     width={720}
  //   >
  //     “Leoo123@winbond.com” is in user ID “Leoo123”. Are you sure you want to
  //     move the account to “winbond123”?
  //   </Modal>
  // )

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
            {props.purchaseDetail ? (
              <div className='ad-form-group-value'>
                {props.purchaseDetail.purchase_number}
              </div>
            ) : (
              <Select
                value={data.purchase_id}
                placeholder='Please select'
                onChange={(val) => onSelect('purchase_id', val)}
              >
                {purchaseList.map((item: any, index: number) => (
                  <Option value={item.id} key={item.id}>
                    {item.purchase_number}
                  </Option>
                ))}
              </Select>
            )}
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
                ? `${purchaseDetail.duration_start}-${purchaseDetail.duration_end}`
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

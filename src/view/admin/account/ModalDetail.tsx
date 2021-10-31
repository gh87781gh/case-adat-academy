import { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MyContext } from '../../../storage'
import AccountApi from '../../../api/AccountApi'
import ModalEdit from './ModalEdit'
import { Row, Col, Button, Modal } from 'antd'

interface IProps {
  isShow: boolean
  onCancel: () => void
  accountId: string
  getAccountList: () => void
  showModalRecord: (account_id: string) => void
}

const ModalDetail = (props: IProps) => {
  const api = new AccountApi()
  const context = useContext(MyContext)

  const [accountDetail, setAccountDetail] = useState<any>({})
  const getAccountDetail = () => {
    context.setIsLoading(true)
    api
      .getAccountDetail(props.accountId)
      .then((res: any) => setAccountDetail(res))
      .catch()
      .finally(() => {
        context.setIsLoading(false)
      })
  }
  useEffect(() => {
    if (props.isShow) {
      getAccountDetail()
    }
  }, [props.isShow]) // eslint-disable-line react-hooks/exhaustive-deps

  const [isModalEditShow, setIsModalEditShow] = useState<boolean>(false)
  const [isModalConfirmShow, setIsModalConfirmShow] = useState<boolean>(false)
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
            switchStatus(false)
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
      {accountDetail.purchases?.length > 0
        ? `“${accountDetail.user_id}” is now under the purchase number “${accountDetail.purchases[0].purchase_number}”. Are you sure you want to
      disable the account’s course access?`
        : null}
    </Modal>
  )
  const switchStatus = (enable: boolean) => {
    context.setIsLoading(true)
    api
      .switchAccountStatus(accountDetail.id, enable)
      .then(() => {
        props.getAccountList()
        getAccountDetail()
      })
      .catch()
      .finally(() => {
        context.setIsLoading(false)
      })
  }
  const handleStatusChange = () => {
    if (accountDetail.status === 'Enabled') {
      accountDetail.purchases.length > 0 && accountDetail.user_id
        ? setIsModalConfirmShow(true)
        : switchStatus(false)
    } else if (accountDetail.status === 'Disabled') {
      switchStatus(true)
    }
  }

  return (
    <>
      <Modal
        className='ad-modal-info'
        title={
          <>
            Account details
            <div className='ad-btn-group ad-float-right'>
              <Button
                key='Edit'
                type='primary'
                onClick={() => setIsModalEditShow(true)}
              >
                Edit
              </Button>
              <Button
                key='View'
                onClick={() => props.showModalRecord(accountDetail.id)}
              >
                View records
              </Button>
              <Button key='Switch' onClick={() => handleStatusChange()}>
                {accountDetail.status === 'Enabled'
                  ? 'Disable'
                  : accountDetail.status === 'Disabled'
                  ? 'Enable'
                  : ''}
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
              {accountDetail.purchases?.length > 0 ? (
                <>
                  <div className='ad-form-group-value'>
                    {accountDetail.purchases[0].purchase_number}
                  </div>
                  <Link to={`/admin/${accountDetail.id}`} target='_blank'>
                    <Button type='link'>open purchase</Button>
                  </Link>
                </>
              ) : (
                '-'
              )}
            </div>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={6}>
            <div className='ad-form-group'>
              <label>Use ID</label>
              <div className='ad-form-group-value'>{accountDetail.user_id}</div>
            </div>
          </Col>
          <Col span={6}>
            <div className='ad-form-group'>
              <label>Current email</label>
              <div className='ad-form-group-value'>{accountDetail.email}</div>
            </div>
          </Col>
          <Col span={6}>
            <div className='ad-form-group'>
              <label>Current status</label>
              <div className='ad-form-group-value'>{accountDetail.status}</div>
            </div>
          </Col>
        </Row>
      </Modal>
      {renderConfirmModal()}
      <ModalEdit
        isShow={isModalEditShow}
        onCancel={() => setIsModalEditShow(false)}
        getAccounts={props.getAccountList}
        getAccountDetail={() => getAccountDetail()}
        accountDetail={accountDetail}
      />
    </>
  )
}
export default ModalDetail

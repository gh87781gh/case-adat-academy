import { useState, useEffect, useContext } from 'react'
import { MyContext, StaticService } from 'storage'
import PurchaseApi from 'api/PurchaseApi'
import ModalCreate from '../account/ModalCreate'
import ModalDetail from '../account/ModalDetail'
import ModalRecord from '../account/ModalRecord'
import { Row, Col, Button, Table, Breadcrumb } from 'antd'

interface IProps {
  prev: () => void
  purchaseId: string
  setPurchaseId: (id: string) => void
}

const PurchaseAccount = (props: IProps) => {
  const context = useContext(MyContext)
  const api = new PurchaseApi()

  const [purchaseDetail, setPurchaseDetail] = useState<any>({})
  const [list, setList] = useState<any>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [accountId, setAccountId] = useState<string>('')
  const [userId, setUserId] = useState<string>('')
  const columns = [
    {
      title: 'User ID',
      dataIndex: 'user_id',
      key: 'user_id'
    },
    {
      title: 'Current email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Current purchase number',
      dataIndex: 'purchase_number',
      key: 'purchase_number'
    },
    {
      title: 'Current status',
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: 'Actions',
      key: 'action',
      dataIndex: 'action',
      width: 220,
      render: (text: any, record: any) => (
        <div className='ad-btn-group'>
          <Button
            key='more'
            size='small'
            onClick={() => {
              setUserId(record.user_id)
              setAccountId(record.id)
              setIsModalDetailShow(true)
            }}
          >
            More
          </Button>
          <Button
            key='view'
            size='small'
            onClick={() => {
              setUserId(record.user_id)
              setAccountId(record.id)
              setIsModalRecordShow(true)
            }}
          >
            View Record
          </Button>
        </div>
      )
    }
  ]
  const getList = async () => {
    context.setIsLoading(true)
    await api
      .getPurchaseDetail(props.purchaseId)
      .then((res: any) => setPurchaseDetail(res.data))
      .finally(() => context.setIsLoading(false))
    await api
      .getPurchaseAccount(props.purchaseId, page)
      .then((res: any) => {
        setList(res.data)
        setTotal(res.total)
      })
      .finally(() => context.setIsLoading(false))
  }
  useEffect(() => {
    getList()
  }, [page]) // eslint-disable-line react-hooks/exhaustive-deps

  const [isModalCreateShow, setIsModalCreateShow] = useState<boolean>(false)
  const [isModalDetailShow, setIsModalDetailShow] = useState<boolean>(false)
  const [isModalRecordShow, setIsModalRecordShow] = useState<boolean>(false)

  return (
    <>
      <Breadcrumb separator='>'>
        <Breadcrumb.Item onClick={props.prev}>
          Purchase management
        </Breadcrumb.Item>
        <Breadcrumb.Item>Account</Breadcrumb.Item>
      </Breadcrumb>
      <h1 className='ad-layout-article-title'>
        Account
        <Button
          className='ad-float-right'
          type='primary'
          onClick={() => {
            setIsModalCreateShow(true)
          }}
        >
          Create account
        </Button>
      </h1>
      <div className='ad-layout-article-toolBar'>
        <Row gutter={20}>
          <Col span={8}>
            <div className='ad-form-group ad-form-group-horizontal'>
              <label>purchase number</label>
              <div className='ad-form-group-value'>
                {purchaseDetail.purchase_number}
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className='ad-form-group ad-form-group-horizontal'>
              <label>Quota</label>
              <div className='ad-form-group-value'>
                {purchaseDetail.usage} used/ {purchaseDetail.quata}
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className='ad-form-group ad-form-group-horizontal'>
              <label>Status</label>
              <div className='ad-form-group-value'>{purchaseDetail.status}</div>
            </div>
          </Col>
        </Row>
      </div>
      <Table
        columns={columns}
        dataSource={list}
        pagination={{
          pageSize: StaticService.tablePageSize,
          current: page,
          total,
          onChange: (page: number) => setPage(page)
        }}
      />
      <ModalCreate
        isShow={isModalCreateShow}
        onCancel={() => setIsModalCreateShow(false)}
        getList={() => getList()}
        purchaseDetail={purchaseDetail}
      />
      <ModalDetail
        isShow={isModalDetailShow}
        onCancel={() => setIsModalDetailShow(false)}
        accountId={accountId}
        getAccountList={() => getList()}
        showModalRecord={() => setIsModalRecordShow(true)}
      />
      <ModalRecord
        isShow={isModalRecordShow}
        onCancel={() => setIsModalRecordShow(false)}
        accountId={accountId}
        userId={userId}
      />
    </>
  )
}
export default PurchaseAccount

import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { MyContext, StaticService } from 'storage'
import PurchaseApi from 'api/admin/PurchaseApi'

import Header from 'view/user/layout/Header'
import AdminSideBar from 'view/admin/AdminSideBar'
import ModalCreate from 'view/admin/account/ModalCreate'
import ModalDetail from 'view/admin/account/ModalDetail'
import ModalRecord from 'view/admin/account/ModalRecord'

import { Row, Col, Button, Table, Breadcrumb } from 'antd'

interface IProps {
  prev: () => void
  purchaseId: string
  setPurchaseId: (id: string) => void
}

const PurchaseAccount = (props: IProps) => {
  const context = useContext(MyContext)
  const api = new PurchaseApi()
  const { purchaseId } = useParams<{ purchaseId: string }>()

  // init page data
  const [purchaseDetail, setPurchaseDetail] = useState<any>({})
  const getList = async (toPage?: number) => {
    const page = toPage ?? 1
    setPage(page)

    context.setIsLoading(true)
    await api
      .getPurchaseDetail(purchaseId)
      .then((res: any) => setPurchaseDetail(res.data))
    await api
      .getPurchaseAccount(purchaseId, page)
      .then((res: any) => {
        setList(res.data)
        setTotal(res.total)
      })
      .finally(() => context.setIsLoading(false))
  }
  useEffect(() => {
    getList()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // table
  const [list, setList] = useState<any>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
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
        <div className='aa-btn-group'>
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

  // modal
  const [accountId, setAccountId] = useState<string>('')
  const [userId, setUserId] = useState<string>('')
  const [isModalCreateShow, setIsModalCreateShow] = useState<boolean>(false)
  const [isModalDetailShow, setIsModalDetailShow] = useState<boolean>(false)
  const [isModalRecordShow, setIsModalRecordShow] = useState<boolean>(false)

  return (
    <>
      <Header />
      <div className='aa-layout-admin'>
        <AdminSideBar />
        <article>
          <>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item onClick={props.prev}>
                Purchase management
              </Breadcrumb.Item>
              <Breadcrumb.Item>Account</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className='aa-layout-admin-article-title'>
              Account
              <Button
                className='aa-float-right'
                type='primary'
                onClick={() => {
                  setIsModalCreateShow(true)
                }}
              >
                Create account
              </Button>
            </h1>
            <div className='aa-layout-admin-article-toolBar'>
              <Row gutter={20}>
                <Col span={8}>
                  <div className='aa-form-group aa-form-group-horizontal'>
                    <label>purchase number</label>
                    <div className='aa-form-group-value'>
                      {purchaseDetail.purchase_number}
                    </div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className='aa-form-group aa-form-group-horizontal'>
                    <label>Quota</label>
                    <div className='aa-form-group-value'>
                      {purchaseDetail.usage} used/ {purchaseDetail.quata}
                    </div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className='aa-form-group aa-form-group-horizontal'>
                    <label>Status</label>
                    <div className='aa-form-group-value'>
                      {purchaseDetail.status}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
            <Table
              className='aa-admin-table'
              columns={columns}
              dataSource={list}
              pagination={{
                pageSize: StaticService.tablePageSize,
                current: page,
                total,
                onChange: (page: number) => getList(page)
              }}
            />
          </>
        </article>
      </div>
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
        getList={() => getList(page)}
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

import { useState, useEffect, useContext } from 'react'
import { MyContext } from 'storage'
import GlobalApi from 'api/GlobalApi'
import AccountApi from 'api/AccountApi'
import { IconSearch } from 'utility/icon'
import Header from 'view/layout/Header'
import AdminSideBar from '../AdminSideBar'
import ModalCreate from './ModalCreate'
import ModalDetail from './ModalDetail'
import ModalRecord from './ModalRecord'
import { Row, Col, Button, Input, Select, Table } from 'antd'
const { Option } = Select

interface IState {
  purchase_number: string
  status: string
  keyword: string
}

const Index = () => {
  const context = useContext(MyContext)
  const api_global = new GlobalApi()
  const api = new AccountApi()

  const [purchaseNumberOption, setPurchaseNumberOption] = useState<any>([])
  const [statusOption, setStatusOption] = useState<any>([])
  const [data, setData] = useState<IState>({
    purchase_number: '',
    status: '',
    keyword: ''
  })
  const [list, setList] = useState([])
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
            View record
          </Button>
        </div>
      )
    }
  ]
  const [accountId, setAccountId] = useState<string>('')
  const [userId, setUserId] = useState<string>('')
  const onSelect = (key: string, value: any) => {
    setData({ ...data, [key]: value })
  }
  const onChange = (key: string, e: any) => {
    const value = e.target.value
    if (value) {
      switch (key) {
        // TODO
        case 'keyword':
          // if (value && ValidateStr('isSymbol', value)) return false
          break
      }
    }
    setData({ ...data, [key]: value })
  }
  const getList = () => {
    context.setIsLoading(true)
    api
      .getAccounts()
      .then((res: any) => setList(res))
      .finally(() => context.setIsLoading(false))
  }
  useEffect(() => {
    api_global
      .getOptions([
        'account_management_purchase_number',
        'account_management_status'
      ])
      .then((res: any) => {
        setPurchaseNumberOption(res[0])
        setStatusOption(res[1])
      })
      .finally(() => context.setIsLoading(false))

    getList()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [isModalCreateShow, setIsModalCreateShow] = useState<boolean>(false)
  const [isModalRecordShow, setIsModalRecordShow] = useState<boolean>(false)
  const [isModalDetailShow, setIsModalDetailShow] = useState<boolean>(false)

  return (
    <>
      <Header />
      <div className='ad-layout-admin'>
        <AdminSideBar />
        <article>
          <h1 className='ad-layout-article-title'>
            Account management
            <Button
              className='ad-float-right'
              type='primary'
              onClick={() => setIsModalCreateShow(true)}
            >
              Create account
            </Button>
          </h1>
          <div className='ad-layout-article-toolBar'>
            <Row gutter={20}>
              <Col span={8}>
                <div className='ad-form-group ad-form-group-horizontal'>
                  <label style={{ minWidth: '200px' }}>
                    Current purchase number
                  </label>
                  <Select
                    value={data.purchase_number}
                    placeholder='Please select'
                    onChange={(val) => onSelect('purchase_number', val)}
                  >
                    {purchaseNumberOption.map((item: string) => (
                      <Option value={item} key={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>
              <Col span={8}>
                <div className='ad-form-group ad-form-group-horizontal'>
                  <label style={{ minWidth: '120px' }}>Current status</label>
                  <Select
                    value={data.status}
                    placeholder='Please select'
                    onChange={(val) => onSelect('status', val)}
                  >
                    {statusOption.map((item: string) => (
                      <Option value={item} key={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>
              <Col span={8}>
                <Input
                  placeholder='Search User ID or Current email'
                  prefix={<IconSearch />}
                  onChange={(e) => onChange('keyword', e)}
                />
              </Col>
            </Row>
          </div>
          <Table columns={columns} dataSource={list} />
          <ModalCreate
            isShow={isModalCreateShow}
            onCancel={() => setIsModalCreateShow(false)}
            getList={() => getList()}
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
        </article>
      </div>
    </>
  )
}
export default Index

import { useState, useEffect, useContext, useRef } from 'react'
import { MyContext, StaticService } from 'storage'
import GlobalApi from 'api/GlobalApi'
import AccountApi from 'api/admin/AccountApi'
import { ValidateStr } from 'utility/validate'
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
  search: string
}

const Index = () => {
  const context = useContext(MyContext)
  const api_global = new GlobalApi()
  const api = new AccountApi()

  const [purchaseNumberOption, setPurchaseNumberOption] = useState<any>([])
  const [statusOption, setStatusOption] = useState<any>([])
  useEffect(() => {
    api_global
      .getOptions([
        'account_management_purchase_number',
        'account_management_status'
      ])
      .then((res: any) => {
        setPurchaseNumberOption(res.data[0])
        setStatusOption(res.data[1])
      })
      .finally(() => context.setIsLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [data, setData] = useState<IState>({
    purchase_number: '',
    status: '',
    search: ''
  })
  const onSelect = (key: string, value: any) => {
    setData({ ...data, [key]: value })
  }
  const onChange = (key: string, e: any) => {
    const value = e.target.value
    if (value) {
      switch (key) {
        case 'search':
          if (value && ValidateStr('isSymbol', value)) return false
          break
      }
    }
    setData({ ...data, [key]: value })
  }

  const [list, setList] = useState([])
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
  const getList = (toPage?: number) => {
    const page = toPage ?? 1
    setPage(page)

    context.setIsLoading(true)
    api
      .getAccounts({ ...data, page })
      .then((res: any) => {
        setList(res.data)
        setTotal(res.total)
      })
      .finally(() => context.setIsLoading(false))
  }

  const isInitMount = useRef(true)
  useEffect(() => {
    if (isInitMount.current) {
      isInitMount.current = false
    } else {
      if (!data.search) getList()
    }
  }, [data.search]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    getList()
  }, [data.purchase_number, data.status]) // eslint-disable-line react-hooks/exhaustive-deps

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
                    allowClear={true}
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
                    allowClear={true}
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
                  value={data.search}
                  placeholder='Search User ID or Current email'
                  prefix={<IconSearch onClick={() => getList()} />}
                  onPressEnter={() => getList()}
                  onChange={(e) => onChange('search', e)}
                  allowClear={true}
                />
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
              onChange: (page: number) => getList(page)
            }}
          />
          <ModalCreate
            isShow={isModalCreateShow}
            onCancel={() => setIsModalCreateShow(false)}
            getList={() => getList()}
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
        </article>
      </div>
    </>
  )
}
export default Index

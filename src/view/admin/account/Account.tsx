import { useState, useEffect, useContext } from 'react'
import { MyContext } from '../../../storage'
import AccountApi from '../../../api/AccountApi'
import { IconSearch } from '../../../utility/icon'
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

const Account = () => {
  const context = useContext(MyContext)
  const api = new AccountApi()

  const [isModalCreateShow, setIsModalCreateShow] = useState<boolean>(false)
  const [isModalRecordShow, setIsModalRecordShow] = useState<boolean>(false)
  const [isModalDetailShow, setIsModalDetailShow] = useState<boolean>(false)

  const [data, setData] = useState<IState>({
    purchase_number: '',
    status: '',
    keyword: ''
  })
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

  const [list, setList] = useState([])
  const [accountDetail, setAccountDetail] = useState<any>({})
  const [accountId, setAccountId] = useState<string>('')
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
      dataIndex: 'enable',
      key: 'enable',
      render: (text: any) => <>{text ? 'Enabled' : 'Disabled'}</>
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
              setAccountDetail(record)
              setIsModalRecordShow(true)
            }}
          >
            View record
          </Button>
        </div>
      )
    }
  ]
  const getList = () => {
    context.setIsLoading(true)
    api
      .getAccounts()
      .then((res: any) => {
        setList(res)
      })
      .catch()
      .finally(() => {
        context.setIsLoading(false)
      })
  }
  useEffect(() => {
    getList()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
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
              <label>Current purchase number</label>
              <Select
                value={data.purchase_number}
                placeholder='Please select'
                onChange={(val) => onSelect('purchase_number', val)}
              >
                <Option value={'purchase_number_a'}>purchase_number A</Option>
                <Option value={'purchase_number_b'}>purchase_number B</Option>
                {/* TODO */}
                {/* {optionIndustry.map((item: any) => (
                  <Option value={item.value} key={item.value}>
                    {item.name}
                  </Option>
                ))} */}
              </Select>
            </div>
          </Col>
          <Col span={8}>
            <div className='ad-form-group ad-form-group-horizontal'>
              <label>Current status</label>
              <Select
                value={data.status}
                placeholder='Please select'
                onChange={(val) => onSelect('status', val)}
              >
                <Option value={'active'}>Active</Option>
                <Option value={'expired'}>Expired</Option>
                {/* TODO */}
                {/* {optionIndustry.map((item: any) => (
                  <Option value={item.value} key={item.value}>
                    {item.name}
                  </Option>
                ))} */}
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
        getAccounts={() => getList()}
      />
      <ModalDetail
        isShow={isModalDetailShow}
        onCancel={() => setIsModalDetailShow(false)}
        accountId={accountId}
        getAccountList={() => getList()}
        showModalRecord={(account_id: string) => {
          setAccountDetail(list.find((item: any) => item.id === account_id))
          setIsModalRecordShow(true)
        }}
      />
      <ModalRecord
        isShow={isModalRecordShow}
        onCancel={() => setIsModalRecordShow(false)}
        accountDetail={accountDetail}
      />
    </>
  )
}
export default Account

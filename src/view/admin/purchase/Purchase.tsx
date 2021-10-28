import { useState, useEffect, useContext } from 'react'
import { MyContext } from '../../../storage'
import PurchaseApi from '../../../api/PurchaseApi'
import ModalCreate from './ModalCreate'
import ModalDetail from './ModalDetail'
import { IconSearch } from '../../../utility/icon'
import moment from 'moment'
import { Row, Col, Button, Input, Select, Table } from 'antd'
const { Option } = Select

interface IProps {
  next: () => void
  purchaseId: string
  setPurchaseId: (id: string) => void
}
interface IState {
  company: string
  status: string
  keyword: string
}

const Purchase = (props: IProps) => {
  const api = new PurchaseApi()
  const context = useContext(MyContext)

  const [isModalEditShow, setIsModalEditShow] = useState(false)
  const [isModalDetailShow, setIsModalDetailShow] = useState(false)
  const [data, setData] = useState<IState>({
    company: '',
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

  const [purchaseList, setPurchaseList] = useState([])
  const getPurchaseList = () => {
    // TOCHECK 送搜尋條件
    context.setIsLoading(true)
    api
      .getPurchases()
      .then((res: any) => {
        setPurchaseList(res)
      })
      .catch()
      .finally(() => {
        context.setIsLoading(false)
      })
  }
  useEffect(() => {
    getPurchaseList()
  }, [])

  const columns = [
    {
      title: 'Purchase number',
      dataIndex: 'purchase_number',
      key: 'purchase_number'
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company'
    },
    {
      title: 'Course access',
      dataIndex: 'course_access',
      key: 'course_access'
    },
    {
      title: 'Quota',
      dataIndex: 'quata',
      key: 'quata',
      render: (text: string, record: any) => (
        <>
          {record.usage} used/ {text}
        </>
      )
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      width: 270,
      render: (text: string, record: any) => (
        <>
          {moment(record.duration_start).format('YYYY/MM/DD')}-
          {moment(record.duration_end).format('YYYY/MM/DD')}
        </>
      )
    },
    {
      title: 'Status',
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
              props.setPurchaseId(record.id)
              setIsModalDetailShow(true)
            }}
          >
            More
          </Button>
          <Button
            key='view'
            size='small'
            onClick={() => {
              props.setPurchaseId(record.id)
              props.next()
            }}
          >
            View Account
          </Button>
        </div>
      )
    }
  ]
  return (
    <>
      <h1 className='ad-layout-article-title'>
        Purchase management
        <Button
          className='ad-float-right'
          type='primary'
          onClick={() => {
            setIsModalEditShow(true)
          }}
        >
          Create purchase
        </Button>
      </h1>
      <div className='ad-layout-article-toolBar'>
        <Row gutter={20}>
          <Col span={8}>
            <div className='ad-form-group ad-form-group-horizontal'>
              <label>Company</label>
              <Select
                value={data.company}
                placeholder='Please select'
                onChange={(val) => onSelect('company', val)}
              >
                <Option value={'company_a'}>Company A</Option>
                <Option value={'company_b'}>Company B</Option>
                {/* TOCHECK */}
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
              <label>Status</label>
              <Select
                value={data.status}
                placeholder='Please select'
                onChange={(val) => onSelect('status', val)}
              >
                <Option value={'active'}>Active</Option>
                <Option value={'expired'}>Expired</Option>
                {/* TOCHECK */}
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
              placeholder='Search purchase number'
              prefix={<IconSearch />}
              onChange={(e) => onChange('keyword', e)}
            />
          </Col>
        </Row>
      </div>
      <Table columns={columns} dataSource={purchaseList} />
      <ModalDetail
        isShow={isModalDetailShow}
        onCancel={() => setIsModalDetailShow(false)}
        purchaseId={props.purchaseId}
        getPurchaseList={() => getPurchaseList()}
      />
      <ModalCreate
        mode='CREATE'
        isShow={isModalEditShow}
        onCancel={() => setIsModalEditShow(false)}
        getPurchaseList={() => getPurchaseList()}
      />
    </>
  )
}
export default Purchase

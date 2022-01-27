import { useState, useEffect, useContext, useRef } from 'react'
import { MyContext, StaticService } from 'storage'
import GlobalApi from 'api/GlobalApi'
import PurchaseApi from 'api/admin/PurchaseApi'
import { ValidateStr } from 'utility/validate'
import ModalCreate from './ModalCreate'
import ModalDetail from './ModalDetail'
import { IconSearch } from 'utility/icon'
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
  search: string
}

const Purchase = (props: IProps) => {
  const context = useContext(MyContext)
  const api_global = new GlobalApi()
  const api = new PurchaseApi()

  const [companyOption, setCompanyOption] = useState<any>([])
  const [statusOption, setStatusOption] = useState<any>([])
  useEffect(() => {
    api_global
      .getOptions(['purchase_management_company', 'purchase_management_status'])
      .then((res: any) => {
        setCompanyOption(res.data[0])
        setStatusOption(res.data[1])
      })
      .finally(() => context.setIsLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [data, setData] = useState<IState>({
    company: '',
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

  const [list, setList] = useState<any>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
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
          {record.duration_start}-{record.duration_end}
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
  const getList = (toPage?: number) => {
    const page = toPage ?? 1
    setPage(page)

    context.setIsLoading(true)
    api
      .getPurchases({ ...data, page })
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
  }, [data.company, data.status]) // eslint-disable-line react-hooks/exhaustive-deps

  const [isModalEditShow, setIsModalEditShow] = useState(false)
  const [isModalDetailShow, setIsModalDetailShow] = useState(false)

  return (
    <>
      <h1 className='ad-layout-admin-article-title'>
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
      <div className='ad-layout-admin-article-toolBar'>
        <Row gutter={20}>
          <Col span={8}>
            <div className='ad-form-group ad-form-group-horizontal'>
              <label>Company</label>
              <Select
                value={data.company}
                placeholder='Please select'
                onChange={(val) => onSelect('company', val)}
                allowClear={true}
              >
                {companyOption.map((item: string) => (
                  <Option value={item} key={item}>
                    {item}
                  </Option>
                ))}
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
              placeholder='Search purchase number'
              prefix={<IconSearch onClick={() => getList()} />}
              onPressEnter={() => getList()}
              onChange={(e) => onChange('search', e)}
              allowClear={true}
            />
          </Col>
        </Row>
      </div>
      <Table
        className='ad-admin-table'
        columns={columns}
        dataSource={list}
        pagination={{
          pageSize: StaticService.tablePageSize,
          current: page,
          total,
          onChange: (page: number) => getList(page)
        }}
      />
      <ModalDetail
        isShow={isModalDetailShow}
        onCancel={() => setIsModalDetailShow(false)}
        purchaseId={props.purchaseId}
        getList={() => getList(page)}
      />
      <ModalCreate
        mode='CREATE'
        isShow={isModalEditShow}
        onCancel={() => setIsModalEditShow(false)}
        getList={() => getList()}
      />
    </>
  )
}
export default Purchase

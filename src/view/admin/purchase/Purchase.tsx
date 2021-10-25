import { useState, useEffect, useContext } from 'react'
import { MyContext } from '../../../storage'
import PurchaseApi from '../../../api/PurchaseApi'
import ModalEdit from './ModalEdit'
import ModalDetail from './ModalDetail'
import ModalAccount from './ModalAccount'
import { IconSearch } from '../../../utility/icon'
import moment from 'moment'
import { Row, Col, Button, Input, Select, Table, Breadcrumb } from 'antd'
const { Option } = Select

interface IState {
  company: string
  status: string
  keyword: string
}

const Purchase = () => {
  const api = new PurchaseApi()
  const context = useContext(MyContext)

  const [modalEditMode, setModalEditMode] = useState('CREATE')
  const [isModalEditShow, setIsModalEditShow] = useState(false)
  const [isModalDetailShow, setIsModalDetailShow] = useState(false)
  const [isModalAccountShow, setIsModalAccountShow] = useState(false)

  const [list, setList] = useState([])
  const [record, setRecord] = useState('')
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
      dataIndex: 'Status',
      key: 'Status'
      // TOCHECK
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
              setPurchaseId(record.id)
              setIsModalDetailShow(true)
            }}
          >
            More
          </Button>
          <Button
            key='view'
            size='small'
            // onClick={props.onCancel}
          >
            View account
          </Button>
        </div>
      )
    }
  ]
  const getList = () => {
    // TOCHECK 送搜尋條件
    context.setIsLoading(true)
    api
      .getPurchases()
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
  }, [])

  const [purchaseDetail, setPurchaseDetail] = useState({})
  const [purchaseId, setPurchaseId] = useState<string>('')
  const getPurchaseDetail = () => {
    context.setIsLoading(true)
    api
      .getPurchaseDetail(purchaseId)
      .then((res: any) => setPurchaseDetail(res))
      .catch()
      .finally(() => {
        context.setIsLoading(false)
      })
  }
  useEffect(() => {
    if (isModalDetailShow) getPurchaseDetail()
  }, [isModalDetailShow])

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
        case 'keyword':
          // if (value && ValidateStr('isSymbol', value)) return false
          break
      }
    }
    setData({ ...data, [key]: value })
  }

  const [step, setStep] = useState(0)
  const renderPurchase = () => (
    <>
      <h1 className='ad-article-title'>
        Purchase management
        <Button
          className='ad-float-right'
          type='primary'
          onClick={() => {
            setModalEditMode('CREATE')
            setIsModalEditShow(true)
          }}
        >
          Create purchase
        </Button>
      </h1>
      <div className='ad-article-toolBar'>
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
                {/* TODO list */}
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
              placeholder='Search purchase number'
              prefix={<IconSearch />}
              onChange={(e) => onChange('keyword', e)}
            />
          </Col>
        </Row>
      </div>
      <Table columns={columns} dataSource={list} />
    </>
  )
  const renderAccount = () => (
    <>
      <h1 className='ad-article-title'>
        Account
        <Button
          className='ad-float-right'
          type='primary'
          onClick={() => {
            setModalEditMode('CREATE')
            setIsModalEditShow(true)
          }}
        >
          Create account
        </Button>
      </h1>
      <div className='ad-article-toolBar'>
        <Row gutter={20}>
          <Col span={8}>
            <div className='ad-form-group ad-form-group-horizontal'>
              <label>purchase number</label>
              <div className='ad-form-group-value'>Winbond202108</div>
            </div>
          </Col>
          <Col span={6}>
            <div className='ad-form-group ad-form-group-horizontal'>
              <label>Quota</label>
              <div className='ad-form-group-value'>2 used/ 5</div>
            </div>
          </Col>
          <Col span={6}>
            <div className='ad-form-group ad-form-group-horizontal'>
              <label>Status</label>
              <div className='ad-form-group-value'>Active</div>
            </div>
          </Col>
        </Row>
      </div>
      <Table columns={columns} dataSource={list} />
    </>
  )

  return (
    <>
      {step === 1 ? (
        <Breadcrumb separator='>'>
          <Breadcrumb.Item onClick={() => setStep(1)}>
            Purchase management
          </Breadcrumb.Item>
          <Breadcrumb.Item>Account</Breadcrumb.Item>
        </Breadcrumb>
      ) : null}
      {step === 0 ? renderPurchase() : renderAccount()}
      <ModalEdit
        mode={modalEditMode}
        isShow={isModalEditShow}
        onCancel={() => setIsModalEditShow(false)}
        getList={() => getList()}
        getPurchaseDetail={() => getPurchaseDetail()}
        purchaseDetail={purchaseDetail}
      />
      <ModalDetail
        isShow={isModalDetailShow}
        onCancel={() => setIsModalDetailShow(false)}
        showEditModal={() => {
          setModalEditMode('UPDATE')
          setIsModalEditShow(true)
        }}
        purchaseDetail={purchaseDetail}
        getList={() => getList()}
      />
      <ModalAccount
        isShow={isModalAccountShow}
        onCancel={() => setIsModalAccountShow(false)}
      />
    </>
  )
}
export default Purchase

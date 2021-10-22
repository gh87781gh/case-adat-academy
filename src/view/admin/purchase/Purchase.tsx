import { useState } from 'react'
import ModalEdit from './ModalEdit'
import ModalDetail from './ModalDetail'
import ModalAccount from './ModalAccount'
import { IconSearch } from '../../../utility/icon'
import { Row, Col, Button, Input, Select, Table, Breadcrumb } from 'antd'
const { Option } = Select

interface IState {
  purchase_number: string
  company: string
  quata: number
  duration_start: string
  duration_end: string
  remarks: string
}

const Purchase = () => {
  const [list, setList] = useState([])
  const [data, setData] = useState<IState>({
    purchase_number: '',
    company: '',
    quata: 0,
    duration_start: '',
    duration_end: '',
    remarks: ''
  })
  const columns = [
    {
      title: 'Purchase number',
      dataIndex: 'number',
      key: 'number',
      render: (text: any) => <a>{text}</a>
    },
    {
      title: 'Company',
      dataIndex: 'Company',
      key: 'Company'
    },
    {
      title: 'Course access',
      dataIndex: 'access',
      key: 'access'
    },
    {
      title: 'Quota',
      dataIndex: 'Quota',
      key: 'Quota'
    },
    {
      title: 'Duration',
      dataIndex: 'Duration',
      key: 'Duration'
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status'
    },
    {
      title: 'Actions',
      key: 'Actions',
      dataIndex: 'Actions'
      // render: (tags: any) => (
      //   <>
      //     {tags.map((tag) => {
      //       let color = tag.length > 5 ? 'geekblue' : 'green'
      //       if (tag === 'loser') {
      //         color = 'volcano'
      //       }
      //       return (
      //         <Tag color={color} key={tag}>
      //           {tag.toUpperCase()}
      //         </Tag>
      //       )
      //     })}
      //   </>
      // )
    }
    // {
    //   title: 'Action',
    //   key: 'action'
    //   // render: (text, record) => (
    //   //   <Space size='middle'>
    //   //     <a>Invite {record.name}</a>
    //   //     <a>Delete</a>
    //   //   </Space>
    //   // )
    // }
  ]

  const [modalEditMode, setModalEditMode] = useState('CREATE')
  const [isModalEditShow, setIsModalEditShow] = useState(false)
  const [isModalDetailShow, setIsModalDetailShow] = useState(false)
  const [isModalAccountShow, setIsModalAccountShow] = useState(true)

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
              <label className='required'>Company</label>
              <Select
                // value={data.industry}
                placeholder='Please select'
                // onChange={(val) => onSelect('industry', val)}
              >
                <Option value={'test'}>test</Option>
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
              <label className='required'>Company</label>
              <Select
                // value={data.industry}
                placeholder='Please select'
                // onChange={(val) => onSelect('industry', val)}
              >
                <Option value={'test'}>test</Option>
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
              placeholder='Search course content'
              prefix={<IconSearch />}
            />
          </Col>
        </Row>
      </div>
      <Table columns={columns} dataSource={list} />
      <ModalEdit
        mode={modalEditMode}
        isShow={isModalEditShow}
        onCancel={() => setIsModalEditShow(false)}
      />
      <ModalDetail
        isShow={isModalDetailShow}
        data={{ test: 1 }}
        onCancel={() => setIsModalDetailShow(false)}
        showCreateModal={() => {
          setModalEditMode('UPDATE')
          setIsModalEditShow(true)
        }}
      />
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
      <ModalAccount
        isShow={isModalAccountShow}
        onCancel={() => setIsModalAccountShow(false)}
      />
    </>
  )

  return (
    <>
      <Breadcrumb separator='>'>
        <Breadcrumb.Item>Purchase management</Breadcrumb.Item>
        <Breadcrumb.Item>Account</Breadcrumb.Item>
      </Breadcrumb>
      {/* {renderPurchase()} */}
      {renderAccount()}
    </>
  )
}
export default Purchase

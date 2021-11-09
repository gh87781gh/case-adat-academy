import { useState, useEffect, useContext } from 'react'
import { MyContext } from 'storage'
import GlobalApi from 'api/GlobalApi'
import AdminApi from 'api/AdminApi'
import { IconSearch } from 'utility/icon'
import Header from 'view/layout/Header'
import AdminSideBar from '../AdminSideBar'
import ModalCreate from './ModalCreate'
import { Row, Col, Button, Input, Select, Table } from 'antd'
const { Option } = Select

interface IState {
  role: string
  search: string
}

const Index = () => {
  const context = useContext(MyContext)
  const api_global = new GlobalApi()
  const api = new AdminApi()

  const [roleOption, setRoleOption] = useState<any>([])
  const [data, setData] = useState<IState>({
    role: '',
    search: ''
  })
  const [list, setList] = useState([])
  const columns = [
    {
      title: 'User ID',
      dataIndex: 'user_id',
      key: 'user_id'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role'
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
              setAdminId(record.id)
              setIsModalCreateShow(true)
            }}
          >
            Edit
          </Button>
        </div>
      )
    }
  ]
  const [adminId, setAdminId] = useState<string>('')
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
      .getAdmins()
      .then((res: any) => setList(res))
      .finally(() => context.setIsLoading(false))
  }
  useEffect(() => {
    api_global
      .getOptions(['admin_roles'])
      .then((res: any) => {
        setRoleOption(res[0])
      })
      .finally(() => context.setIsLoading(false))

    getList()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [isModalCreateShow, setIsModalCreateShow] = useState<boolean>(false)

  return (
    <>
      <Header />
      <div className='ad-layout-admin'>
        <AdminSideBar />
        <article>
          <h1 className='ad-layout-article-title'>
            Admin management
            <Button
              className='ad-float-right'
              type='primary'
              onClick={() => setIsModalCreateShow(true)}
            >
              Create admin
            </Button>
          </h1>
          <div className='ad-layout-article-toolBar'>
            <Row gutter={20}>
              <Col span={6}>
                <div className='ad-form-group ad-form-group-horizontal'>
                  <label style={{ minWidth: '50px' }}>Role</label>
                  <Select
                    value={data.role}
                    placeholder='Please select'
                    onChange={(val) => onSelect('role', val)}
                  >
                    {roleOption.map((item: string) => (
                      <Option value={item} key={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>
              <Col span={8} offset={10}>
                <Input
                  placeholder='Search User ID'
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
            adminId={adminId}
          />
        </article>
      </div>
    </>
  )
}
export default Index

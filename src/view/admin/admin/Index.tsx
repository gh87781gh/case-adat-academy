import { useState, useEffect, useContext, useRef } from 'react'
import { MyContext, StaticService } from 'storage'
import GlobalApi from 'api/GlobalApi'
import AdminApi from 'api/admin/AdminApi'

import Header from 'view/user/layout/Header'
import AdminSideBar from '../AdminSideBar'
import ModalCreate from './ModalCreate'

import schema from 'utility/validate'
import { IconSearch } from 'utility/icon'
import { Btn } from 'utility/component'
import { Row, Col, Input, Select, Table } from 'antd'
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
  useEffect(() => {
    api_global
      .getOptions(['admin_management_roles'])
      .then((res: any) => {
        setRoleOption(res.data[0])
      })
      .finally(() => context.setIsLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [data, setData] = useState<IState>({
    role: '',
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
          if (schema.search.validateStr(value)) return false
          break
      }
    }
    setData({ ...data, [key]: value })
  }

  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [adminId, setAdminId] = useState('')
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
        <div className='aa-btn-group'>
          <Btn
            feature='primary'
            key='more'
            size='small'
            onClick={() => {
              setAdminId(record.id)
              setIsModalCreateShow(true)
            }}
          >
            Edit
          </Btn>
        </div>
      )
    }
  ]
  const getList = (toPage?: number) => {
    const page = toPage ?? 1
    setPage(page)

    context.setIsLoading(true)
    api
      .getAdmins(data)
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
  }, [data.role]) // eslint-disable-line react-hooks/exhaustive-deps

  const [isModalCreateShow, setIsModalCreateShow] = useState<boolean>(false)

  return (
    <>
      <Header />
      <div className='aa-layout-admin'>
        <AdminSideBar />
        <article>
          <h1 className='aa-layout-admin-article-title'>
            Admin management
            <Btn
              feature='action'
              className='aa-float-right'
              type='primary'
              onClick={() => {
                setAdminId('')
                setIsModalCreateShow(true)
              }}
            >
              Create admin
            </Btn>
          </h1>
          <div className='aa-layout-admin-article-toolBar'>
            <Row gutter={20}>
              <Col span={9}>
                <div className='aa-form-group aa-form-group-horizontal'>
                  <label style={{ minWidth: '50px' }}>Role</label>
                  <Select
                    value={data.role || undefined}
                    placeholder={StaticService.placeholder.select}
                    onChange={(val: any) => onSelect('role', val)}
                    style={{ minWidth: '50px' }}
                  >
                    <Option value='' key='All'>
                      All
                    </Option>
                    {roleOption.map((item: string) => (
                      <Option value={item} key={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>
              <Col span={8} offset={7}>
                <Input
                  value={data.search}
                  maxLength={schema.search.max}
                  placeholder='Search User ID'
                  prefix={<IconSearch onClick={() => getList()} />}
                  onPressEnter={() => getList()}
                  onChange={(e) => onChange('search', e)}
                  allowClear={true}
                />
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
        </article>
      </div>
      <ModalCreate
        isShow={isModalCreateShow}
        onCancel={() => setIsModalCreateShow(false)}
        getList={(keepPage?: boolean) => {
          keepPage ? getList(page) : getList()
        }}
        adminId={adminId}
      />
    </>
  )
}
export default Index

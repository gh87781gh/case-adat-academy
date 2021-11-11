import { useState, useEffect, useContext, useRef } from 'react'
import { MyContext, StaticService } from 'storage'
import GlobalApi from 'api/GlobalApi'
import CourseApi from 'api/admin/CourseApi'
import { ValidateStr } from 'utility/validate'
import ModalCreate from './ModalCreate'
// import ModalDetail from './ModalDetail'
import { IconSearch } from 'utility/icon'
import { Row, Col, Button, Input, Select, Table } from 'antd'
const { Option } = Select

interface IProps {
  next: (step: number) => void
}
interface IState {
  status: string
  search: string
}

const Course = (props: IProps) => {
  const context = useContext(MyContext)
  const api_global = new GlobalApi()
  const api = new CourseApi()

  const [statusOption, setStatusOption] = useState<any>([])
  useEffect(() => {
    api_global
      .getOptions(['course_status'])
      .then((res: any) => setStatusOption(res.data[0]))
      .finally(() => context.setIsLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [data, setData] = useState<IState>({
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
  const [courseId, setCourseId] = useState('')
  const columns = [
    {
      title: 'Course name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Last updated time',
      dataIndex: 'last_update_time',
      key: 'last_update_time'
    },
    {
      title: 'Editor',
      dataIndex: 'editor',
      key: 'editor'
    },
    {
      title: 'Course description',
      dataIndex: 'description',
      key: 'description'
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
      width: 370,
      render: (text: any, record: any) => (
        <div className='ad-btn-group'>
          <Button
            key='switch'
            size='small'
            onClick={() =>
              switchCourse(record.id, record.status === 'Active' ? false : true)
            }
          >
            {record.status === 'Active' ? 'Inactivate' : 'Activate'}
          </Button>
          <Button
            key='edit'
            size='small'
            onClick={() => {
              // props.setPurchaseId(record.id)
              // setIsModalDetailShow(true)
              props.next(1)
            }}
          >
            Edit
          </Button>
          <Button
            key='editCourse'
            size='small'
            onClick={() => {
              setCourseId(record.id)
              setIsModalCreateShow(true)
            }}
          >
            Edit course information
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
      .getCourses({ ...data, page })
      .then((res: any) => {
        setList(res.data)
        setTotal(res.total)
      })
      .finally(() => context.setIsLoading(false))
  }
  const switchCourse = (id: string, enable: boolean) => {
    context.setIsLoading(true)
    api
      .switchCourse(id, enable)
      .then(() => getList())
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
  }, [data.status]) // eslint-disable-line react-hooks/exhaustive-deps

  const [isModalCreateShow, setIsModalCreateShow] = useState(false)

  return (
    <>
      <h1 className='ad-layout-article-title'>
        Course management
        <div className='ad-float-right ad-btn-group'>
          <Button type='primary' onClick={() => setIsModalCreateShow(true)}>
            Create course
          </Button>
          <Button onClick={() => props.next(2)}>Edit learning path</Button>
        </div>
      </h1>
      <div className='ad-layout-article-toolBar'>
        <Row gutter={20}>
          <Col span={6}>
            <div className='ad-form-group ad-form-group-horizontal'>
              <label style={{ minWidth: '50px' }}>Status</label>
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
          <Col span={8} offset={10}>
            <Input
              value={data.search}
              placeholder='Search course name'
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
        getList={(keepPage?: boolean) => {
          keepPage ? getList(page) : getList()
        }}
        courseId={courseId}
      />
    </>
  )
}
export default Course

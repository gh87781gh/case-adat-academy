import { useState, useEffect, useContext } from 'react'
import { MyContext, StaticService } from 'storage'
import CourseApi from 'api/admin/CourseApi'
import { IconMenu, IconArrowUp, IconMore, IconPlus } from 'utility/icon'
import { Row, Col, Button, Table, Breadcrumb } from 'antd'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Menu from './courseDetail/Menu'

interface IProps {
  prev: () => void
  courseId: string
}

const CourseDetail = (props: IProps) => {
  const [courseDetail, setCourseDetail] = useState<any>({})
  const [menu, setMenu] = useState([
    {
      level: 'group',
      id: '1-1',
      text: '1-1',
      parentId: '',
      isShowChildren: null,
      isShow: true,
      children: []
    },
    {
      level: 'group',
      id: '1-2',
      text: '1-2',
      parentId: '',
      isShowChildren: true,
      isShow: true,
      children: ['1-3', '1-6', '1-7', '1-8', '1-9']
    },
    {
      level: 'chapter',
      id: '1-3',
      text: '1-3',
      parentId: '1-2',
      isShowChildren: true,
      isShow: true,
      children: ['1-6', '1-7', '1-8']
    },
    {
      level: 'section',
      id: '1-6',
      text: '1-6',
      parentId: '1-3',
      isShowChildren: null,
      isShow: true,
      children: []
    },
    {
      level: 'section',
      id: '1-7',
      text: '1-7',
      parentId: '1-3',
      isShowChildren: null,
      isShow: true,
      children: []
    },
    {
      level: 'section',
      id: '1-8',
      text: '1-8',
      parentId: '1-3',
      isShowChildren: null,
      isShow: true,
      children: []
    },
    {
      level: 'chapter',
      id: '1-9',
      text: '1-9',
      parentId: '1-2',
      isShowChildren: null,
      isShow: true,
      children: []
    },
    {
      level: 'group',
      id: '1-5',
      text: '1-5',
      parentId: '',
      isShowChildren: null,
      isShow: true,
      children: []
    }
  ])

  return (
    <>
      <Breadcrumb separator='>'>
        <Breadcrumb.Item onClick={props.prev}>
          Course management
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          1234
          {/* TODO */}
          {courseDetail.name}
        </Breadcrumb.Item>
      </Breadcrumb>
      <h1 className='ad-layout-article-title'>
        {courseDetail.name}
        <span className='ad-float-right'>{courseDetail.status}</span>
      </h1>
      <Row gutter={20}>
        <Col span={6}>
          <DndProvider backend={HTML5Backend}>
            <Menu menu={menu} setMenu={(menu: any) => setMenu(menu)} />
          </DndProvider>
        </Col>
        <Col span={18}></Col>
      </Row>
    </>
  )
}
export default CourseDetail

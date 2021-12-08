import { useState, useEffect, useContext, useRef } from 'react'
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
  const context = useContext(MyContext)
  const api = new CourseApi()

  const [courseDetail, setCourseDetail] = useState<any>({})
  let [addLevelACount, setAddLevelACount] = useState<number>(0) // for addChild in menu
  const [currentSection, setCurrentSection] = useState<any>({})
  const [menu, setMenu] = useState([
    // {
    //   level: 1,
    //   key: '1',
    //   name: 'group name',
    //   isShowChildren: null,
    //   isShow: true
    // }
  ])

  const getInitData = async () => {
    context.setIsLoading(true)
    await api
      .getCourseDetail(props.courseId)
      .then((res: any) => setCourseDetail(res.data))
    await api
      .getCourseChapter(props.courseId)
      .then((res: any) => setMenu(res))
      .finally(() => context.setIsLoading(false))
  }

  useEffect(() => {
    getInitData()
  }, [])

  return (
    <>
      <Breadcrumb separator='>'>
        <Breadcrumb.Item onClick={props.prev}>
          Course management
        </Breadcrumb.Item>
        <Breadcrumb.Item>{courseDetail.name}</Breadcrumb.Item>
      </Breadcrumb>
      <h1 className='ad-layout-article-title'>
        {courseDetail.name}
        {/* TOCHECK */}
        <span className='ad-float-right'>{courseDetail.status}</span>
      </h1>
      <Row gutter={20}>
        <Col span={7}>
          <DndProvider backend={HTML5Backend}>
            <Menu
              type='COURSE_MENU'
              menu={menu}
              setMenu={(menu: any) => setMenu(menu)}
              addLevelACount={addLevelACount}
            />
          </DndProvider>
          <div
            className='ad-course-menu-addGroup'
            onClick={() => setAddLevelACount(addLevelACount + 1)}
          >
            <span>
              <em></em>
              <em></em>
            </span>
          </div>
        </Col>
        <Col span={17}></Col>
      </Row>
    </>
  )
}
export default CourseDetail

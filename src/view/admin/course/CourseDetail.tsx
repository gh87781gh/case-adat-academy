import { useState, useEffect, useContext, useRef } from 'react'
import { MyContext, StaticService } from 'storage'
import CourseApi from 'api/admin/CourseApi'
import { IconMenu, IconArrowUp, IconMore, IconPlus } from 'utility/icon'
import { Row, Col, Button, Table, Breadcrumb } from 'antd'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Menu from './courseDetail/Menu'
import Sections from './courseDetail/Sections'

interface IProps {
  prev: () => void
  courseId: string
}

const CourseDetail = (props: IProps) => {
  const context = useContext(MyContext)
  const api = new CourseApi()

  const [courseDetail, setCourseDetail] = useState<any>({})
  let [addLevelACount, setAddLevelACount] = useState<number>(0) // for addChild in menu
  const [menu, setMenu] = useState([
    {
      level: 1,
      key: '1',
      name: 'group name',
      isShowChildren: true,
      isShow: true
    },
    {
      level: 2,
      key: '1-1',
      name: 'chapter name',
      isShowChildren: true,
      isShow: true
    },
    {
      level: 3,
      key: '1-1-1',
      name: 'section name',
      isShowChildren: null,
      isShow: true,
      sections: [
        {
          // type: 'title | picture | video | paragraph',
          key: '1',
          type: 'video',
          content: '',
          archive_id: 'id_oiuytredsxcvbnjkl'
        },
        {
          // type: 'title | picture | video | paragraph',
          key: '2',
          type: 'title',
          content: 'blablabla2',
          archive_id: 'id_oiuytredsxcvbnjkl'
        }
      ]
    }
  ])
  const [sections, setSections] = useState<any>([])

  // const handleCurrentSectionChange = (sections: any) => {
  //   if (currentSectionIndex !== null) {
  //     setMenu((menu[currentSectionIndex].sections = sections))
  //   }
  // }

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
        <span className='ad-float-right'>{courseDetail.status}status</span>
        {/* TOCHECK */}
      </h1>
      <Row gutter={20}>
        <Col span={7}>
          <DndProvider backend={HTML5Backend}>
            <Menu
              type='COURSE_MENU'
              menu={menu}
              setMenu={(menu: any) => setMenu(menu)}
              addLevelACount={addLevelACount}
              handleCurrentSection={(index: number) => {
                setSections(menu[index].sections)
              }}
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
        <Col span={17}>
          <h2>{sections.name}</h2>
          <DndProvider backend={HTML5Backend}>
            <Sections
              menu={sections}
              setMenu={(menu: any) => setMenu(menu)}
              addLevelACount={addLevelACount}
            />
          </DndProvider>
        </Col>
      </Row>
    </>
  )
}
export default CourseDetail

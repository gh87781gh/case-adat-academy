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
  const [menu, setMenu] = useState([
    {
      level: 'A',
      key: '1',
      text: 'group name1',
      isShowChildren: true,
      isShow: true
    },
    {
      level: 'B',
      key: '1-1',
      text: 'chapter name1',
      isShowChildren: null,
      isShow: true
    },
    {
      level: 'B',
      key: '1-2',
      text: 'chapter name2',
      isShowChildren: true,
      isShow: true
    },
    {
      level: 'C',
      key: '1-2-1',
      text: 'section name1',
      isShowChildren: null,
      isShow: true
    }
  ])

  const addChild = (clickItem?: any) => {
    const ary: any = [...menu]
    let lastDownLevelChildId: string = ''
    let insertIndex: number | null = null

    switch (clickItem?.level) {
      case 'A':
        ary[clickItem.index].isShowChildren = true
        for (let i = clickItem.index + 1; i < ary.length; i++) {
          if (ary[i].key.split('-')[0] === clickItem.key) {
            if (ary[i].level === 'B') lastDownLevelChildId = ary[i].key
          } else {
            insertIndex = i
            break
          }
        }
        ary.splice(insertIndex ?? ary.length, 0, {
          level: 'B',
          key: lastDownLevelChildId
            ? `${clickItem.key}-${
                Number(lastDownLevelChildId.split('-')[1]) + 1
              }`
            : `${clickItem.key}-1`,
          text: 'chapter name',
          isShowChildren: null,
          isShow: true
        })
        break
      case 'B':
        ary[clickItem.index].isShowChildren = true
        for (let i = clickItem.index + 1; i < ary.length; i++) {
          if (
            `${ary[i].key.split('-')[0]}-${ary[i].key.split('-')[1]}` ===
            clickItem.key
          ) {
            if (ary[i].level === 'C') lastDownLevelChildId = ary[i].key
          } else {
            insertIndex = i
            break
          }
        }
        ary.splice(insertIndex ?? ary.length, 0, {
          level: 'C',
          key: lastDownLevelChildId
            ? `${clickItem.key}-${
                Number(lastDownLevelChildId.split('-')[2]) + 1
              }`
            : `${clickItem.key}-1`,
          text: 'chapter name',
          isShowChildren: null,
          isShow: true
        })
        break
      default:
        const groups = menu.filter((item: any) => item.level === 'A')
        ary.push({
          level: 'A',
          key: `${groups.length + 1}`,
          text: 'group name',
          isShowChildren: null,
          isShow: true,
          children: []
        })
    }
    setMenu(ary)
  }
  const getMenu = () => {
    context.setIsLoading(true)
    api
      .getCourseMenu()
      .then((res: any) => {
        // setList(res.data)
        // setTotal(res.total)
      })
      .finally(() => context.setIsLoading(false))
  }
  useEffect(() => {
    getMenu()
  }, [])

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
        <Col span={7}>
          <DndProvider backend={HTML5Backend}>
            <Menu
              menu={menu}
              setMenu={(menu: any) => setMenu(menu)}
              addChild={(clickItem: any) => addChild(clickItem)}
            />
          </DndProvider>
          <div className='ad-course-menu-addGroup' onClick={() => addChild()}>
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

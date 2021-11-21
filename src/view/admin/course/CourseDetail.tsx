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

interface IMenuData {
  level: string
  id: string
  text: string
  isShowChildren: boolean
  isShow: boolean
  children?: {
    level: string
    id: string
    text: string
    isShowChildren: boolean
    isShow: boolean
    children?: {}
  }
}

const CourseDetail = (props: IProps) => {
  const [courseDetail, setCourseDetail] = useState<any>({})
  // const [menu, setMenu] = useState([
  //   {
  //     level: 'group',
  //     id: '1-1',
  //     text: '1-1',
  //     parentId: '',
  //     isShowChildren: null,
  //     isShow: true,
  //     children: []
  //   },
  //   {
  //     level: 'group',
  //     id: '1-2',
  //     text: '1-2',
  //     parentId: '',
  //     isShowChildren: true,
  //     isShow: true,
  //     children: ['1-3', '1-6', '1-7', '1-8', '1-9']
  //   },
  //   {
  //     level: 'chapter',
  //     id: '1-3',
  //     text: '1-3',
  //     parentId: '1-2',
  //     isShowChildren: true,
  //     isShow: true,
  //     children: ['1-6', '1-7', '1-8']
  //   },
  //   {
  //     level: 'section',
  //     id: '1-6',
  //     text: '1-6',
  //     parentId: '1-3',
  //     isShowChildren: null,
  //     isShow: true,
  //     children: []
  //   },
  //   {
  //     level: 'section',
  //     id: '1-7',
  //     text: '1-7',
  //     parentId: '1-3',
  //     isShowChildren: null,
  //     isShow: true,
  //     children: []
  //   },
  //   {
  //     level: 'section',
  //     id: '1-8',
  //     text: '1-8',
  //     parentId: '1-3',
  //     isShowChildren: null,
  //     isShow: true,
  //     children: []
  //   },
  //   {
  //     level: 'chapter',
  //     id: '1-9',
  //     text: '1-9',
  //     parentId: '1-2',
  //     isShowChildren: null,
  //     isShow: true,
  //     children: []
  //   },
  //   {
  //     level: 'group',
  //     id: '1-5',
  //     text: '1-5',
  //     parentId: '',
  //     isShowChildren: null,
  //     isShow: true,
  //     children: []
  //   }
  // ])
  // const [menu, setMenu] = useState([
  //   {
  //     level: 'group',
  //     id: '1',
  //     text: 'group name1',
  //     isShowChildren: true,
  //     isShow: true,
  //     children: [
  //       {
  //         level: 'chapter',
  //         id: '1-1',
  //         text: 'chapter name1',
  //         isShowChildren: true,
  //         isShow: true,
  //         children: [
  //           {
  //             level: 'section',
  //             id: '1-1-1',
  //             text: 'section name',
  //             isShowChildren: null,
  //             isShow: true
  //           }
  //         ]
  //       },
  //       {
  //         level: 'chapter',
  //         id: '1-2',
  //         text: 'chapter name2',
  //         isShowChildren: true,
  //         isShow: true,
  //         children: []
  //       }
  //     ]
  //   }
  // ])
  const [menu, setMenu] = useState([
    {
      level: 'group',
      id: '1',
      text: 'group name1',
      isShowChildren: true,
      isShow: true
    },
    {
      level: 'chapter',
      id: '1-1',
      text: 'chapter name1',
      isShowChildren: null,
      isShow: true
    },
    {
      level: 'chapter',
      id: '1-2',
      text: 'chapter name2',
      isShowChildren: true,
      isShow: true
    },
    {
      level: 'section',
      id: '1-2-1',
      text: 'group name1',
      isShowChildren: null,
      isShow: true
    }
  ])

  const addChild = (clickItem?: any) => {
    const ary: any = [...menu]
    let lastDownLevelChildId: string = ''
    let insertIndex: number | null = null

    switch (clickItem?.level) {
      case 'group':
        ary[clickItem.index].isShowChildren = true
        for (let i = clickItem.index + 1; i < ary.length; i++) {
          if (ary[i].id.split('-')[0] === clickItem.id) {
            if (ary[i].level === 'chapter') lastDownLevelChildId = ary[i].id
          } else {
            insertIndex = i
            break
          }
        }
        ary.splice(insertIndex ?? ary.length, 0, {
          level: 'chapter',
          id: lastDownLevelChildId
            ? `${clickItem.id}-${
                Number(lastDownLevelChildId.split('-')[1]) + 1
              }`
            : `${clickItem.id}-1`,
          text: 'chapter name',
          isShowChildren: null,
          isShow: true
        })
        break
      case 'chapter':
        ary[clickItem.index].isShowChildren = true
        for (let i = clickItem.index + 1; i < ary.length; i++) {
          if (
            `${ary[i].id.split('-')[0]}-${ary[i].id.split('-')[1]}` ===
            clickItem.id
          ) {
            if (ary[i].level === 'section') lastDownLevelChildId = ary[i].id
          } else {
            insertIndex = i
            break
          }
        }
        ary.splice(insertIndex ?? ary.length, 0, {
          level: 'section',
          id: lastDownLevelChildId
            ? `${clickItem.id}-${
                Number(lastDownLevelChildId.split('-')[2]) + 1
              }`
            : `${clickItem.id}-1`,
          text: 'chapter name',
          isShowChildren: null,
          isShow: true
        })
        break
      default:
        const groups = menu.filter((item: any) => item.level === 'group')
        ary.push({
          level: 'group',
          id: `${groups.length + 1}`,
          text: 'group name',
          isShowChildren: null,
          isShow: true,
          children: []
        })
    }
    setMenu(ary)
  }

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
            add group
          </div>
        </Col>
        <Col span={17}></Col>
      </Row>
    </>
  )
}
export default CourseDetail

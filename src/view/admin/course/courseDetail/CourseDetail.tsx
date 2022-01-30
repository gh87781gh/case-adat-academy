import { useState, useEffect, useContext } from 'react'
import { MyContext } from 'storage'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import CourseApi from 'api/admin/CourseApi'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import Header from 'view/layout/Header'
import AdminSideBar from '../../AdminSideBar'
import CourseDetailMenu from './Menu'
import Sections from './Sections'

import {
  IconArrowPrev,
  IconArrowNext,
  IconBookmark,
  IconBookmarked,
  IconLevels,
  IconSuccessfully
} from 'utility/icon'
import { Btn, UploadVideo } from 'utility/component'
import { Row, Col, Breadcrumb, message, Dropdown, Menu } from 'antd'
const { SubMenu } = Menu

const CourseDetail = () => {
  const context = useContext(MyContext)
  const api = new CourseApi()
  const history = useHistory()
  const location = useLocation()
  const { courseId, sectionId } =
    useParams<{ courseId: string; sectionId?: string }>()

  // course detail setting
  const [courseName, setCourseName] = useState<string>('')
  const [courseStatus, setCourseStatus] = useState<string>('')

  // course menu
  const [menu, setMenu] = useState<any>([])
  const [menuOpenKeys, setMenuOpenKeys] = useState<any>([])
  const openAllMenuItems = (menu: any) => {
    let menuOpenKeys: string[] = []
    for (const chapter of menu) {
      menuOpenKeys.push(chapter.key)
      for (const section of chapter.children) {
        menuOpenKeys.push(section.key)
      }
    }
    setMenuOpenKeys(menuOpenKeys)
  }
  const parseItemIdToKey = (sectionId: string) => {
    for (const chapter of menu) {
      if (chapter.id === sectionId) {
        return chapter.key
      }
      for (const section of chapter.children) {
        if (section.id === sectionId) {
          return section.key
        }
      }
    }
  }

  // current section
  const [currentSection, setCurrentSection] = useState<any>({})
  const getCurrentSection = (courseId: string, sectionId: string) => {
    context.setIsLoading(true)
    api
      .getCurrentSection(courseId, sectionId)
      .then((res: any) => {
        console.log('test:', res)
        setCurrentSection(res.data)
      })
      .finally(() => context.setIsLoading(false))
  }

  // init page
  const getInitData = (courseId: string, sectionId?: string) => {
    context.setIsLoading(true)

    if (!courseName) {
      api.getCourseDetail(courseId).then((res: any) => {
        setCourseName(res.data.name)
        setCourseStatus(res.data.status)
      })
    }

    api
      .getCourseDetailMenu('MENU', courseId)
      .then((res: any) => {
        setMenu(res.data)
        openAllMenuItems(res.data)

        // 設置 current section
        if (sectionId) {
          // 1. 判斷網址是否有 params: sectionId？
          // 有 sectionId -> 設置 currentSection & prev/next sectionId
          getCurrentSection(courseId, sectionId)
        } else {
          // 無 sectionId -> 抓 menu 的第一個 section 設成 params
          let firstSection: string = ''
          for (const chapter of menu) {
            for (const section of chapter.children) {
              firstSection = section.id
            }
          }
          if (firstSection) history.push(`${location.pathname}/${firstSection}`)
        }
      })
      .finally(() => context.setIsLoading(false))
  }
  useEffect(() => {
    if (courseId) {
      getInitData(courseId, sectionId)
    }
  }, [courseId, sectionId]) // eslint-disable-line react-hooks/exhaustive-deps

  // render
  const renderMenu = () => {
    return (
      <Menu
        className='ad-menu-user-course'
        onOpenChange={(keys: any) => setMenuOpenKeys(keys)}
        openKeys={menuOpenKeys}
        selectedKeys={[sectionId ? parseItemIdToKey(sectionId) : '']}
        mode='inline'
      >
        {menu.map((group: any) => (
          <SubMenu key={group.key} icon={<IconLevels />} title={group.name}>
            {group.children.map((chapter: any) => (
              <SubMenu key={chapter.key} title={chapter.name}>
                {chapter.children.map((section: any) => (
                  <Menu.Item
                    key={section.key}
                    onClick={() =>
                      history.push(
                        `/admin/courseDetail/${courseId}/${section.id}`
                      )
                    }
                  >
                    <div>{section.name}</div>
                  </Menu.Item>
                ))}
              </SubMenu>
            ))}
          </SubMenu>
        ))}
      </Menu>
    )
  }
  const renderCurrentSection = () => {
    return (
      <>
        <h2>{currentSection.name}</h2>
        <UploadVideo
          type='video'
          desc='Upload section video'
          system='course'
          systemId={currentSection.id}
          imgId={currentSection[0]?.archive_id}
          setUploadId={
            (id: string) => console.log('updateSection')
            // updateSection(0, 'video', id)
          }
        />
        <p className='ad-upload-info'>
          Format should be .mp4 The file size limit is 300mb.
          <br /> This section video is required, and will be fixed on the top
        </p>
        <DndProvider backend={HTML5Backend}>
          <Sections
            // TODO 改到這
            sections={currentSection.length > 0 ? currentSection : []}
            setMenu={(menu: any) => setMenu(menu)}
            updateSection={(index: number, type: string, value: string) =>
              // updateSection(index, type, value)
              console.log('test')
            }
            courseId={courseId}
          />
        </DndProvider>
      </>
    )
  }
  return (
    <>
      <Header />
      <div className='ad-layout-admin'>
        <AdminSideBar />
        <article>
          <div className='ad-layout-admin-courseDetail'>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item onClick={() => history.push('/admin/course')}>
                Course management
              </Breadcrumb.Item>
              <Breadcrumb.Item>{courseName}</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className='ad-layout-admin-article-title '>
              {courseName}
              <span style={{ marginLeft: '2rem', fontSize: '20px' }}>
                {courseStatus}
              </span>
            </h1>
            <Row gutter={20}>
              <Col span={7}>
                <div className='ad-layout-admin-article-menu'>
                  {menu.length > 0 ? renderMenu() : null}
                </div>
              </Col>
              <Col span={17} style={{ height: '100%' }}>
                <div className='ad-layout-admin-article-content'>
                  {renderCurrentSection()}
                </div>
              </Col>
            </Row>
            <div className='ad-layout-admin-courseDetail-footer'>
              <div className='ad-btn-group'>
                <Btn
                  feature='action'
                  // onClick={() => editCourseChapter()}
                >
                  Save
                </Btn>
                <Btn feature='primary'>Reset</Btn>
              </div>
            </div>
          </div>
        </article>
      </div>
    </>
  )
}
export default CourseDetail

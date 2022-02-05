import { useState, useEffect, useContext } from 'react'
import { MyContext } from 'storage'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import CourseApi from 'api/admin/CourseApi'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import Header from 'view/layout/Header'
import AdminSideBar from '../../AdminSideBar'
import Sections from './Sections'
import ModalMenuEdit from './ModalMenuEdit'

import { IconLevels } from 'utility/icon'
import { Btn, UploadVideo } from 'utility/component'
import { Row, Col, Breadcrumb, message, Menu } from 'antd'
const { SubMenu } = Menu

const CourseDetail = () => {
  const context = useContext(MyContext)
  const api = new CourseApi()
  const history = useHistory()
  const location = useLocation()
  const { courseId, sectionId } =
    useParams<{ courseId: string; sectionId?: string }>()

  // course detail and menu
  const [courseDetail, setCourseDetail] = useState<any>({})
  const [menu, setMenu] = useState<any>([])
  const [menuOpenKeys, setMenuOpenKeys] = useState<any>([])
  const [isMenuModalShow, setIsMenuModalShow] = useState<boolean>(false)
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
  const getCourseDetail = (courseId: string) => {
    context.setIsLoading(true)
    api
      .getCourseDetail(courseId)
      .then((res: any) => setCourseDetail(res.data))
      .finally(() => context.setIsLoading(false))
  }
  const getCourseDetailMenu = () => {
    api
      .getCourseDetailMenu('MENU', courseId)
      .then((res: any) => {
        setMenu(res.data)
        openAllMenuItems(res.data)
      })
      .finally(() => context.setIsLoading(false))
  }
  useEffect(() => {
    if (courseId) {
      getCourseDetail(courseId)
      getCourseDetailMenu()
    }
  }, [courseId]) // eslint-disable-line react-hooks/exhaustive-deps

  // current section
  const [currentSectionDetail, setCurrentSectionDetail] = useState<any>({})
  const [currentSectionContent, setCurrentSectionContent] = useState<any>([])
  const getCurrentSectionContent = () => {
    context.setIsLoading(true)
    if (courseId && sectionId) {
      api
        .getCurrentSectionContent(courseId, sectionId)
        .then((res: any) => {
          // TOCHECK
          const fakeDetail = {
            name: 'fake name',
            statue: 'fake status'
          }
          setCurrentSectionDetail(fakeDetail)
          setCurrentSectionContent(res.data)
        })
        .finally(() => context.setIsLoading(false))
    }
  }
  const updateCurrentSectionContent = (
    index: number,
    type: string,
    value: string
  ) => {
    const newContent: any = [...currentSectionContent]
    if (type === 'video' || type === 'picture') {
      newContent[index].archive_id = value
    } else {
      newContent[index].content = value
    }
    setCurrentSectionContent(newContent)
  }
  const save = () => {
    if (courseId && sectionId) {
      api
        .saveCurrentSectionContent(courseId, sectionId, currentSectionContent)
        .then((res: any) => {
          setCurrentSectionContent([])
          message.success('Saved')
          getCurrentSectionContent()
        })
        .finally(() => context.setIsLoading(false))
    }
  }
  useEffect(() => {
    if (menu.length > 0 && !sectionId) {
      // 若網址無 sectionId ，則抓第一個做為預設的
      let firstSectionId: string = ''
      for (const group of menu) {
        for (const chapter of group.children) {
          for (const section of chapter.children) {
            if (section.level === 3) firstSectionId = section.id
            break
          }
        }
      }
      history.push(`/admin/courseDetail/${courseId}/${firstSectionId}`)
    }
  }, [menu]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (courseId && sectionId) {
      setCurrentSectionContent([])
      getCurrentSectionContent()
    }
  }, [sectionId]) // eslint-disable-line react-hooks/exhaustive-deps

  // render
  const renderMenu = () => {
    return menu?.length > 0 ? (
      <div className='ad-layout-admin-article-menu'>
        <Menu
          className='ad-menu-user-course'
          onOpenChange={(keys: any) => setMenuOpenKeys(keys)}
          openKeys={menuOpenKeys}
          selectedKeys={[sectionId ? parseItemIdToKey(sectionId) : '']}
          mode='inline'
        >
          {menu.map((group: any) => (
            <SubMenu key={group.key} icon={<IconLevels />} title={group.name}>
              {group.children?.map((chapter: any) => (
                <SubMenu key={chapter.key} title={chapter.name}>
                  {chapter.children?.map((section: any) => (
                    <Menu.Item
                      key={section.key}
                      onClick={() => {
                        history.push(
                          `/admin/courseDetail/${courseId}/${section.id}`
                        )
                      }}
                    >
                      <div>{section.name}</div>
                    </Menu.Item>
                  ))}
                </SubMenu>
              ))}
            </SubMenu>
          ))}
        </Menu>
      </div>
    ) : null
  }
  const renderCurrentSection = () => {
    return (
      <>
        <h2>{currentSectionDetail.name}</h2>
        {currentSectionContent.length > 0 ? (
          <div className='ad-layout-admin-article-content'>
            <UploadVideo
              type='video'
              desc='Upload section video'
              system='course'
              systemId={courseId}
              archiveId={currentSectionContent[0].archive_id}
              setUploadId={(id: string) => {
                updateCurrentSectionContent(0, 'video', id)
              }}
            />
            <p className='ad-upload-info'>
              Format should be .mp4 The file size limit is 300mb.
              <br /> This section video is required, and will be fixed on the
              top
            </p>
            <DndProvider backend={HTML5Backend}>
              <Sections
                sections={currentSectionContent}
                setMenu={(content: any) => setCurrentSectionContent(content)}
                updateSection={(index: number, type: string, value: string) =>
                  updateCurrentSectionContent(index, type, value)
                }
                courseId={courseId}
              />
            </DndProvider>
          </div>
        ) : null}
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
              <Breadcrumb.Item>{courseDetail.name}</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className='ad-layout-admin-article-title'>
              {courseDetail.name}
              <span style={{ marginLeft: '2rem', fontSize: '20px' }}>
                {courseDetail.status}
              </span>
              <Btn
                feature='primary'
                className='ad-float-right'
                onClick={() => setIsMenuModalShow(true)}
              >
                Edit course menu
              </Btn>
            </h1>
            <Row gutter={20} className='ad-layout-admin-article-row'>
              <Col span={7} className='ad-layout-admin-article-row-menu'>
                {renderMenu()}
              </Col>
              <Col span={17} className='ad-layout-admin-article-row-section'>
                {renderCurrentSection()}
                {currentSectionContent.length > 0 ? (
                  <div className='ad-layout-admin-article-row-section-footer'>
                    <div className='ad-btn-group'>
                      <Btn feature='action' onClick={() => save()}>
                        Save
                      </Btn>
                      <Btn
                        feature='primary'
                        onClick={() => getCurrentSectionContent()}
                      >
                        Reset
                      </Btn>
                    </div>
                  </div>
                ) : null}
              </Col>
            </Row>
          </div>
        </article>
      </div>
      <ModalMenuEdit
        isShow={isMenuModalShow}
        onCancel={() => setIsMenuModalShow(false)}
        courseId={courseId}
        getCourseDetailMenu={() => getCourseDetailMenu()}
      />
    </>
  )
}
export default CourseDetail

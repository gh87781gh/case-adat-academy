import { useState, useEffect, useContext } from 'react'
import { MyContext, StaticService } from 'storage'
import { useHistory, useParams, useLocation } from 'react-router-dom'
import CourseApi from 'api/user/CourseApi'
import Header from 'view/user/layout/Header'
import Footer from 'view/user/layout/Footer'
import {
  IconArrowPrev,
  IconArrowNext,
  IconBookmark,
  IconBookmarked,
  IconLevels,
  IconSuccessfully
} from 'utility/icon'
import { Btn, VideoPlayer } from 'utility/component'
import { Row, Col, Breadcrumb, Menu, message, Tooltip } from 'antd'
const { SubMenu } = Menu

const CourseDetail = () => {
  const context = useContext(MyContext)
  const api = new CourseApi()
  const history = useHistory()
  const location = useLocation()
  const { courseId, sectionId } =
    useParams<{ courseId: string; sectionId?: string }>()

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
    for (const group of menu) {
      for (const chapter of group.children) {
        for (const section of chapter.children) {
          if (section.id === sectionId) {
            return section.key
          }
        }
      }
    }
  }

  // current section
  const [currentSection, setCurrentSection] = useState<any>({})
  const [prevSectionId, setPrevSectionId] = useState<string>('')
  const [nextSectionId, setNextSectionId] = useState<string>('')
  const getCurrentSection = (courseId: string, sectionId: string) => {
    context.setIsLoading(true)
    api
      .getCurrentSection(courseId, sectionId)
      .then((res: any) => setCurrentSection(res.data))
      .finally(() => context.setIsLoading(false))
  }
  const setPrevAndNextSection = (menu: any, sectionId: string) => {
    let sections = []
    for (const group of menu) {
      for (const chapter of group.children) {
        for (const section of chapter.children) {
          sections.push(section)
        }
      }
    }
    sections.forEach((section: any, index: number, array: any) => {
      if (section.id === sectionId) {
        setPrevSectionId(array[index - 1]?.id)
        setNextSectionId(array[index + 1]?.id)
        return
      }
    })
  }
  const markAsRead = () => {
    context.setIsLoading(true)
    api
      .markAsRead(courseId, sectionId || '')
      .then(() => getInitData(courseId, sectionId))
      .finally(() => context.setIsLoading(false))
  }

  // handle bookmark of this section
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false)
  const [lastReadSectionId, setLastReadSectionId] = useState<string>('')
  const switchIsBookmarked = () => {
    if (sectionId) {
      context.setIsLoading(true)
      api
        .switchIsBookmarked(courseId, sectionId, isBookmarked)
        .then(() => {
          message.success(!isBookmarked ? 'Bookmarked' : 'No Bookmarked')
          setIsBookmarked(!isBookmarked)
        })
        .finally(() => context.setIsLoading(false))
    }
  }
  const getDefaultIsBookmark = () => {
    if (courseId && sectionId) {
      context.setIsLoading(true)
      api
        .getIsBookmarked(courseId, sectionId)
        .then((res: any) => setIsBookmarked(res.data.result))
        .finally(() => context.setIsLoading(false))
    }
  }
  useEffect(() => {
    if (courseId && sectionId) getDefaultIsBookmark()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // init page / course detail setting
  const [courseName, setCourseName] = useState<string>('')
  const [courseLogoImage, setCourseLogoImage] = useState<string>('')
  const getInitData = (courseId: string, sectionId?: string) => {
    context.setIsLoading(true)
    api
      .getCourseDetail(courseId)
      .then((res: any) => {
        setCourseName(res.name)
        setCourseLogoImage(res.logo_image_id)
        setMenu(res.data)
        openAllMenuItems(res.data)
        setLastReadSectionId(res.last_read_section_id)
      })
      .finally(() => context.setIsLoading(false))
  }
  useEffect(() => {
    if (courseId) {
      getInitData(courseId, sectionId)
    }
  }, [courseId, sectionId]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (menu) {
      // 設置 currentSection
      if (sectionId) {
        // 1. 判斷網址是否有 params: sectionId？
        // 有 sectionId -> 設置 currentSection & prev/next sectionId
        getCurrentSection(courseId, sectionId)
        setPrevAndNextSection(menu, sectionId)
      } else {
        // 無 sectionId ->
        // 2. 判斷是否有前次閱讀紀錄？
        if (lastReadSectionId) {
          // 有 lastReadSectionId -> 將 lastReadSectionId 設成 params
          history.push(`${location.pathname}${lastReadSectionId}`)
        } else {
          // 無 lastReadSectionId -> 將第一個 section 設成 params
          let firstSection: string = ''
          for (const group of menu) {
            for (const chapter of group.children) {
              for (const section of chapter.children) {
                if (section) {
                  firstSection = section.id
                  break
                }
                break
              }
              break
            }
          }
          if (firstSection) history.push(`${location.pathname}/${firstSection}`)
        }
      }
    }
  }, [menu, lastReadSectionId]) // eslint-disable-line react-hooks/exhaustive-deps

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
                      history.push(`/courseDetail/${courseId}/${section.id}`)
                    }
                  >
                    <Tooltip placement='right' title={section.name}>
                      <div>
                        <div>{section.name}</div>
                        <div className='ad-menu-user-course-section-icon'>
                          {section.status === 'All read' ? (
                            <IconSuccessfully className='icon-success' />
                          ) : null}
                        </div>
                      </div>
                    </Tooltip>
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
    const { chapterContentType, apiUrl } = StaticService
    return (
      <div className='ad-course-detail-current-section'>
        <h2>{currentSection.name}</h2>
        {currentSection
          ? currentSection.sections?.map((content: any, index: number) => (
              <div key={index}>
                {content.type === chapterContentType.video ? (
                  <div className='video-box'>
                    <VideoPlayer id={content.archive_id} />
                  </div>
                ) : content.type === chapterContentType.picture ? (
                  <img src={`${apiUrl}/archive/${content.archive_id}`} alt='' />
                ) : content.type === chapterContentType.title ? (
                  <h3>{content.content}</h3>
                ) : content.type === chapterContentType.paragraph ? (
                  <p>{content.content}</p>
                ) : null}
              </div>
            ))
          : null}
        <div className='ad-course-detail-current-section-markRead'>
          {currentSection.status === 'Not started' ? (
            <Btn feature='primary' onClick={markAsRead}>
              Mark as read
            </Btn>
          ) : currentSection.status === 'Finished' ? (
            <div className='success'>
              <IconSuccessfully />
              Section completed
            </div>
          ) : null}
        </div>
        <div className='ad-course-detail-current-section-slide'>
          <Btn
            feature='secondary'
            style={{ visibility: prevSectionId ? 'visible' : 'hidden' }}
            onClick={() =>
              history.push(`/courseDetail/${courseId}/${prevSectionId}`)
            }
          >
            <IconArrowPrev />
            Go to previous section
          </Btn>
          <Btn
            feature='secondary'
            style={{ visibility: nextSectionId ? 'visible' : 'hidden' }}
            onClick={() =>
              history.push(`/courseDetail/${courseId}/${nextSectionId}`)
            }
          >
            Go to next section
            <IconArrowNext />
          </Btn>
        </div>
      </div>
    )
  }
  const renderPrevAndNextSectionBtn = () => {
    return (
      <div className='ad-course-detail-chapterNav'>
        <h3>In section</h3>
        {currentSection
          ? currentSection.sections?.map((chapter: any, index: number) =>
              chapter.type === 'title' ? (
                <div
                  // TODO 點擊滾動到這
                  id={`ad-course-detail-chapterNav-item-${index}`}
                  className='ad-course-detail-chapterNav-item active'
                  key={index}
                >
                  {chapter.content}
                </div>
              ) : null
            )
          : null}
      </div>
    )
  }
  return (
    <>
      <Header />
      <div className='ad-layout-banner'></div>
      <article className='ad-layout-container'>
        <section className='ad-section ad-section-course-detail-breadcrumb ad-breadcrumb'>
          <Breadcrumb separator='|'>
            <Breadcrumb.Item onClick={() => history.push('/course')}>
              <Btn feature='link'>Course</Btn>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <b>{courseName}</b>
            </Breadcrumb.Item>
          </Breadcrumb>
        </section>
        <section className='ad-section ad-section-course-detail-title'>
          <div className='ad-course-detail-title'>
            {courseLogoImage ? (
              <span>
                <img
                  src={`${StaticService.apiUrl}/archive/${courseLogoImage}`}
                  alt=''
                />
              </span>
            ) : null}
            <h1>{courseName}</h1>
          </div>
        </section>
        <section className='ad-section ad-section-course-detail'>
          <Row gutter={20}>
            <Col span={6}>{renderMenu()}</Col>
            <Col span={15}>{renderCurrentSection()}</Col>
            <Col span={3}>
              <div className='ad-course-detail-bookmark'>
                <Btn feature='secondary' onClick={switchIsBookmarked}>
                  {isBookmarked ? <IconBookmarked /> : <IconBookmark />}
                </Btn>
              </div>
              {renderPrevAndNextSectionBtn()}
            </Col>
          </Row>
        </section>
      </article>
      <Footer />
    </>
  )
}
export default CourseDetail

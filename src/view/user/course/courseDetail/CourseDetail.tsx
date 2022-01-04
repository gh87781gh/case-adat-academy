import { useState, useEffect, useContext, useRef } from 'react'
import { MyContext, StaticService } from 'storage'
import { useHistory, useParams } from 'react-router-dom'
import CourseApi from 'api/user/CourseApi'
import Header from 'view/layout/Header'
import Footer from 'view/layout/Footer'
import {
  IconArrowDown,
  IconBookmark,
  IconLevels,
  IconSuccess
} from 'utility/icon'
import { Btn, VideoPlayer } from 'utility/component'
import LearningPath from '../learningPath/LearningPath'
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined
} from '@ant-design/icons'
import { Row, Col, Select, Breadcrumb, Menu } from 'antd'
const { Option } = Select
const { SubMenu } = Menu

interface IState {
  coursesType: string
}

const CourseDetail = () => {
  const context = useContext(MyContext)
  const api = new CourseApi()
  const history = useHistory()
  const { courseId } = useParams<{ courseId: string }>()

  // course detail setting
  const [courseName, setCourseName] = useState<string>('')
  const [courseLogoImage, setCourseLogoImage] = useState<string>('')
  const [lastReadSectionId, setLastReadSectionId] = useState<string>('')
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false)

  // course menu
  const [menuOpenKeys, setMenuOpenKeys] = useState<any>([])
  const [selectedKeys, setSelectedKeys] = useState<any>([])
  const [menu, setMenu] = useState<any>([])

  // current section
  const [currentSection, setCurrentSection] = useState<any>({})
  useEffect(() => {
    if (menu.length > 0 && selectedKeys.length > 0) {
      // set current section
      for (const group of menu) {
        for (const chapter of group.children) {
          for (const section of chapter.children) {
            if (section.key === selectedKeys[0]) {
              setCurrentSection(section)
              break
            }
          }
          break
        }
        break
      }
    }
  }, [menu, selectedKeys]) // eslint-disable-line react-hooks/exhaustive-deps

  // init page
  useEffect(() => {
    context.setIsLoading(true)
    api
      .getCourseDetail(courseId)
      .then((res: any) => {
        setCourseName(res.name)
        setCourseLogoImage(res.logo_image_id)
        setLastReadSectionId(res.last_read_section_id)
        setIsBookmarked(res.is_bookmarked)
        setMenu(res.data)
        setMenuOpenKeys(res.menuOpenKeys)
        setSelectedKeys(res.selectedKeys)
      })
      .finally(() => context.setIsLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const renderMenu = () => {
    return (
      <Menu
        className='ad-menu-user-course'
        onOpenChange={(keys: any) => setMenuOpenKeys(keys)}
        openKeys={menuOpenKeys}
        selectedKeys={selectedKeys}
        mode='inline'
      >
        {menu.map((group: any) => (
          <SubMenu key={group.key} icon={<IconLevels />} title={group.name}>
            {group.children.map((chapter: any) => (
              <SubMenu key={chapter.key} title={chapter.name}>
                {chapter.children.map((section: any) => (
                  <Menu.Item
                    key={section.key}
                    onClick={() => {
                      setSelectedKeys([section.key])
                      setCurrentSection(section)
                    }}
                  >
                    <div>{section.name}</div>
                    <div className='ad-menu-user-course-section-icon'>
                      {section.status === 'All read' ? (
                        <IconSuccess className='icon-success' />
                      ) : null}
                    </div>
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
      <div className='ad-course-detail-current-section'>
        <h2>{currentSection.name}</h2>
        {currentSection
          ? currentSection.sections?.map((content: any, index: number) => (
              <div key={index}>
                {/* props.item.type = title | picture | video | paragraph */}
                {content.type === 'video' ? (
                  <VideoPlayer id={content.archive_id} />
                ) : content.type === 'picture' ? (
                  <img
                    src={`${StaticService.apiUrl}/archive/${content.archive_id}`}
                    alt=''
                  />
                ) : content.type === 'title' ? (
                  <h3>{content.content}</h3>
                ) : content.type === 'paragraph' ? (
                  <p>{content.content}</p>
                ) : null}
              </div>
            ))
          : null}
      </div>
    )
  }
  const renderCurrentSectionChapterNav = () => {
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
            <Breadcrumb.Item onClick={() => history.push('/index')}>
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
                <Btn feature='secondary'>
                  <IconBookmark
                    // TODO icon 的 active 狀態
                    style={{ backgroundColor: isBookmarked ? 'red' : '' }}
                  />
                </Btn>
              </div>
              {renderCurrentSectionChapterNav()}
            </Col>
          </Row>
        </section>
      </article>
      <Footer />
    </>
  )
}
export default CourseDetail

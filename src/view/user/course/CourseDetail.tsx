import { useState, useEffect, useContext } from 'react'
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
import { Btn } from 'utility/component'
import LearningPath from './component/LearningPath'
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

  const [menu, setMenu] = useState<any>([])
  const [courseName, setCourseName] = useState<string>('')
  const [courseLogoImage, setCourseLogoImage] = useState<string>('')
  const [lastReadSectionId, setLastReadSectionId] = useState<string>('')
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false)
  const [currentSection, setCurrentSection] = useState<any>([])

  const getCourseDetail = () => {
    context.setIsLoading(true)
    api
      .getCourseDetail(courseId)
      .then((res: any) => {
        setCourseName(res.name)
        setCourseLogoImage(res.logo_image_id)
        setLastReadSectionId(res.last_read_section_id)
        setIsBookmarked(res.is_bookmarked)
        setMenu(res.data)
      })
      .finally(() => context.setIsLoading(false))
  }

  useEffect(() => {
    getCourseDetail()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (menu) {
      console.log('lastReadSectionId:', lastReadSectionId)
      if (lastReadSectionId) {
        for (const group of menu) {
          console.log('group:', group)

          for (const chapter of group.children) {
            console.log('chapter:', chapter)

            for (const section of chapter.children) {
              console.log('section:', section)
              if (section.sections.length > 0)
                setCurrentSection(section.sections)
              console.log('section.sections:', section.sections)

              break
              // TODO 最後閱讀 id 是正確的後要打開這個
              // if (section.id === lastReadSectionId) {
              //   setCurrentSection(section.sections)
              //   break
              // }
            }
            break
          }
          break
        }
      } else {
        setCurrentSection(menu[0]?.children[0]?.children[0]?.sections)
      }
      console.log('currentSection:', currentSection)
    }
  }, [menu]) // eslint-disable-line react-hooks/exhaustive-deps

  const renderMenu = () => {
    return (
      <Menu
        className='ad-menu-user-course'
        // onClick={this.handleClick}
        style={{ width: 256 }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['1', '1-1', '1-2', '2', '2-1', '2-2']}
        mode='inline'
      >
        {menu.map((group: any) => (
          <SubMenu key={group.key} icon={<IconLevels />} title={group.name}>
            {group.children.map((chapter: any) => (
              <SubMenu key={chapter.key} title={chapter.name}>
                {chapter.children.map((section: any) => (
                  <Menu.Item key={section.key}>
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

  return (
    <>
      <Header />
      <div className='ad-layout-banner'></div>
      <article>
        <section className='ad-layout-container ad-section ad-section-breadcrumb'>
          <Breadcrumb separator='|'>
            <Breadcrumb.Item onClick={() => history.push('/index')}>
              <Btn feature='link'>Course</Btn>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <b>{courseName}</b>
            </Breadcrumb.Item>
          </Breadcrumb>
        </section>
        <section className='ad-layout-container ad-section ad-section-course-detail-title'>
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
        <section className='ad-layout-container ad-section ad-section-course-detail'>
          <Row gutter={20}>
            <Col span={6}>{renderMenu()}</Col>
          </Row>
        </section>
      </article>
      <Footer />
    </>
  )
}
export default CourseDetail

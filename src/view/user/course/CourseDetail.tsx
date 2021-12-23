import { useState, useEffect, useContext } from 'react'
import { MyContext, StaticService } from 'storage'
import { useHistory, useParams } from 'react-router-dom'
import CourseApi from 'api/user/CourseApi'
import Header from 'view/layout/Header'
import Footer from 'view/layout/Footer'
import { IconArrowDown, IconBookmark, IconLevels } from 'utility/icon'
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

  const [menu, setMenu] = useState<any>({})
  const [courseName, setCourseName] = useState<string>('')
  const [courseImage, setCourseImage] = useState<string>('')
  const [lastReadSectionId, setLastReadSectionId] = useState<string>('')
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false)

  const getCourseDetail = () => {
    context.setIsLoading(true)
    api
      .getCourseDetail(courseId)
      .then((res: any) => {
        setMenu(res.data)
        setCourseName(res.name)
        setCourseImage(res.name)
        setLastReadSectionId(res.last_read_section_id)
        setIsBookmarked(res.is_bookmarked)
      })
      .finally(() => context.setIsLoading(false))
  }

  useEffect(() => {
    getCourseDetail()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
        <SubMenu key='1' icon={<IconLevels />} title='Navigation Two'>
          <SubMenu key='1-1' title='Submenu'>
            <Menu.Item key='1-1-1'>
              <div className='ad-menu-user-course-section-text'>Option 7</div>
              <div className='ad-menu-user-course-section-icon'>
                <IconLevels />
              </div>
            </Menu.Item>
            <Menu.Item key='1-1-2'>Option 8</Menu.Item>
          </SubMenu>
          <SubMenu key='1-2' title='Submenu'>
            <Menu.Item key='1-2-1'>Option 7</Menu.Item>
            <Menu.Item key='1-2-2'>Option 8</Menu.Item>
          </SubMenu>
        </SubMenu>
        <SubMenu key='2' icon={<IconLevels />} title='Navigation Two'>
          <SubMenu key='2-1' title='Submenu'>
            <Menu.Item key='2-1-1'>Option 7</Menu.Item>
            <Menu.Item key='2-1-2'>Option 8</Menu.Item>
          </SubMenu>
        </SubMenu>
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
              <b>{courseName}123456</b>
            </Breadcrumb.Item>
          </Breadcrumb>
        </section>
        <section className='ad-layout-container ad-section ad-section-course-detail-title'>
          <div className='ad-course-detail-logo'>
            {setCourseImage ? (
              <img
                src={`${StaticService.apiUrl}/archive/${setCourseImage}`}
                alt=''
              />
            ) : null}
          </div>
          <h1 className='ad-course-detail-title'>{courseName}12345678</h1>
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

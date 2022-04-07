import { useState, useEffect, useContext } from 'react'
import { MyContext } from 'storage'
import { useParams, useHistory } from 'react-router-dom'
import CourseApi from 'api/admin/CourseApi'

import Header from 'view/user/layout/Header'
import AdminSideBar from '../../AdminSideBar'
import Section from './section/Section'
import ModalMenuEdit from './menuEdit/ModalMenuEdit'
import MenuShow from './menu/MenuShow'

import { Btn } from 'utility/component'
import { Row, Col, Breadcrumb } from 'antd'

const CourseDetail = () => {
  const context = useContext(MyContext)
  const api = new CourseApi()
  const history = useHistory()
  const { courseId } = useParams<{ courseId: string; sectionId?: string }>()

  // course detail
  const [courseDetail, setCourseDetail] = useState<any>({})
  const [isModalMenuEditShow, setModalMenuEditShow] = useState<boolean>(false)
  const getCourseDetail = (courseId: string) => {
    context.setIsLoading(true)
    api
      .getCourseDetail(courseId)
      .then((res: any) => setCourseDetail(res.data))
      .finally(() => context.setIsLoading(false))
  }

  // course menu show
  const [menu, setMenu] = useState<any>([])
  const getCourseDetailMenu = () => {
    api
      .getCourseDetailMenu('MENU', courseId)
      .then((res: any) => setMenu(res.data))
      .finally(() => context.setIsLoading(false))
  }

  // init page
  useEffect(() => {
    if (courseId || !isModalMenuEditShow) {
      getCourseDetail(courseId)
      getCourseDetailMenu()
    }
  }, [courseId, isModalMenuEditShow]) // eslint-disable-line react-hooks/exhaustive-deps

  // render
  return (
    <>
      <Header />
      <div className='aa-layout-admin'>
        <AdminSideBar />
        <article>
          <div className='aa-layout-admin-courseDetail'>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item onClick={() => history.push('/admin/course')}>
                Course management
              </Breadcrumb.Item>
              <Breadcrumb.Item>{courseDetail.name}</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className='aa-layout-admin-article-title'>
              {courseDetail.name}
              <span style={{ marginLeft: '2rem', fontSize: '20px' }}>
                {courseDetail.status}
              </span>
              <Btn
                feature='primary'
                className='aa-float-right'
                onClick={() => setModalMenuEditShow(true)}
              >
                Edit course menu
              </Btn>
            </h1>
            {menu.length === 0 ? (
              <article className='aa-layout-container aa-layout-container-prompt'>
                <div className=' aa-layout-container-prompt-content'>
                  <h1 className='aa-title'>No content yet</h1>
                  <p>
                    Please start by editing course menu
                    <br />
                    with button “Edit course menu”
                  </p>
                </div>
              </article>
            ) : (
              <Row gutter={20} className='aa-layout-admin-article-row'>
                <Col span={7} className='aa-layout-admin-article-row-menu'>
                  <MenuShow isModalMenuEditShow={isModalMenuEditShow} />
                </Col>
                <Col span={17} className='aa-layout-admin-article-row-section'>
                  <Section isModalMenuEditShow={isModalMenuEditShow} />
                </Col>
              </Row>
            )}
          </div>
        </article>
      </div>
      <ModalMenuEdit
        isShow={isModalMenuEditShow}
        onCancel={() => setModalMenuEditShow(false)}
        courseId={courseId}
      />
    </>
  )
}
export default CourseDetail

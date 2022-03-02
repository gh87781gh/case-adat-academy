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

  // init page
  useEffect(() => {
    // init course detail data
    if (courseId) getCourseDetail(courseId)
  }, [courseId]) // eslint-disable-line react-hooks/exhaustive-deps

  // render
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
                onClick={() => setModalMenuEditShow(true)}
              >
                Edit course menu
              </Btn>
            </h1>
            <Row gutter={20} className='ad-layout-admin-article-row'>
              <Col span={7} className='ad-layout-admin-article-row-menu'>
                <MenuShow isModalMenuEditShow={isModalMenuEditShow} />
              </Col>
              <Col span={17} className='ad-layout-admin-article-row-section'>
                <Section isModalMenuEditShow={isModalMenuEditShow} />
              </Col>
            </Row>
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

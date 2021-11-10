import { useState, useEffect, useContext } from 'react'
import { MyContext, StaticService } from 'storage'
import CourseApi from 'api/admin/CourseApi'
import { IconMenu, IconArrowUp, IconMore, IconPlus } from 'utility/icon'
import { Row, Col, Button, Table, Breadcrumb } from 'antd'

interface IProps {
  prev: () => void
  courseId: string
}

const CourseDetail = (props: IProps) => {
  const context = useContext(MyContext)
  const api = new CourseApi()

  const [courseDetail, setPurchaseDetail] = useState<any>({})
  // useEffect(() => {
  //   api
  //     .getCourseDetail(props.courseId)
  //     .then((res: any) => {
  //       setList(res.data)
  //       setTotal(res.total)
  //     })
  //     .finally(() => context.setIsLoading(false))
  // }, [page]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Breadcrumb separator='>'>
        <Breadcrumb.Item onClick={props.prev}>
          Course management
        </Breadcrumb.Item>
        <Breadcrumb.Item>{courseDetail.name}</Breadcrumb.Item>
      </Breadcrumb>
      <h1 className='ad-layout-article-title'>
        {courseDetail.name}
        <span className='ad-float-right'>{courseDetail.status}</span>
      </h1>
      <Row gutter={20}>
        <Col span={6}>
          <div className='ad-course-menu'>
            <div className='ad-course-menu-item level-1'>
              <IconMenu className='ad-course-menu-item-btn grab' />
              <IconArrowUp className='ad-course-menu-item-arrowUp' />
              <h6>111</h6>
              <div className='ad-course-menu-item-extra'>
                <IconPlus className='ad-course-menu-item-btn plus' />
                <IconMore className='ad-course-menu-item-btn more' />
              </div>
            </div>
            <div className='ad-course-menu-item level-2'>
              <IconMenu className='ad-course-menu-item-btn grab' />
              <IconArrowUp className='ad-course-menu-item-arrowUp' />
              <h6>111</h6>
              <div className='ad-course-menu-item-extra'>
                <IconPlus className='ad-course-menu-item-btn plus' />
                <IconMore className='ad-course-menu-item-btn more' />
              </div>
            </div>
            <div className='ad-course-menu-item level-3'>
              <IconMenu className='ad-course-menu-item-btn grab' />
              <IconArrowUp className='ad-course-menu-item-arrowUp' />
              <h6>111</h6>
              <div className='ad-course-menu-item-extra'>
                <IconPlus className='ad-course-menu-item-btn plus' />
                <IconMore className='ad-course-menu-item-btn more' />
              </div>
            </div>
          </div>
        </Col>
        <Col span={18}></Col>
      </Row>
    </>
  )
}
export default CourseDetail

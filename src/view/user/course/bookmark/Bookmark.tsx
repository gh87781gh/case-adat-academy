import { useState, useEffect, useContext } from 'react'
import { MyContext, StaticService } from 'storage'
import { useHistory } from 'react-router-dom'
import CourseApi from 'api/user/CourseApi'
import Header from 'view/layout/Header'
import Footer from 'view/layout/Footer'
import { Btn } from 'utility/component'
import Card from '../component/Card'
import { Row, Col, Breadcrumb, Pagination } from 'antd'

interface IState {
  coursesType: string
}

const Bookmark = () => {
  const context = useContext(MyContext)
  const api = new CourseApi()
  const history = useHistory()

  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const getCoursesByLearningPath = (toPage?: number) => {
    const page = toPage ?? 1
    setPage(page)

    // context.setIsLoading(true)
    // api
    //   .getCoursesByLearningPath(data.coursesType, { page })
    //   .then((res: any) => {
    //     setList(res.data)
    //     setTotal(res.total)
    //   })
    //   .finally(() => context.setIsLoading(false))
  }

  // useEffect(() => {
  //   getCoursesByLearningPath()
  // }, [data.coursesType]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Header />
      <div className='ad-breadcrumb'>
        <Breadcrumb separator='|'>
          <Breadcrumb.Item onClick={() => history.push('/index')}>
            <Btn feature='link'>Course</Btn>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <b>Bookmark</b>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <article className='ad-page-container'>
        <h1 className='ad-title'>Bookmark</h1>
        <section className='ad-section-bookmark'>
          <Card
            type='BOOKMARK'
            subtitle={'ADB CONTROL CENTER'}
            title={'What is ADB Control Center?'}
            text={'Lorem ipsum dolor sit amet consectetur adipisicing elit.'}
          />
          <Card
            type='BOOKMARK'
            subtitle={'ADB CONTROL CENTER'}
            title={'What is ADB Control Center?'}
            text={'Lorem ipsum dolor sit amet consectetur adipisicing elit.'}
          />
          <Row gutter={20}>
            <Col span={10}>
              <div className='ad-section-bookmark-result'>
                <span>24</span> Bookmarks
              </div>
            </Col>
            <Col span={14} className='ad-text-right'>
              <Pagination
                current={page}
                total={total}
                onChange={(page: number) => getCoursesByLearningPath(page)}
              />
            </Col>
          </Row>
        </section>
      </article>
      <Footer />
    </>
  )
}
export default Bookmark

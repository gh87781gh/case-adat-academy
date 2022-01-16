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

const Index = () => {
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
      <article className='ad-page-container'>
        <h1 className='ad-title'>Search result</h1>
        <section className='ad-section-card'>
          <div
            className='ad-text-right ad-color-primary'
            style={{ marginBottom: '24px' }}
          >
            Can’t find the solutions? Please visit{' '}
            <Btn feature='link'>help center</Btn>
          </div>
          <Card
            type='SEARCH'
            subtitle={'ADB CONTROL CENTER'}
            title={'What is ADB Control Center?'}
            text={'Lorem ipsum dolor sit amet consectetur adipisicing elit.'}
          />
          <Card
            type='SEARCH'
            subtitle={'ADB CONTROL CENTER'}
            title={'What is ADB Control Center?'}
            text={'Lorem ipsum dolor sit amet consectetur adipisicing elit.'}
          />
          <Row gutter={20}>
            <Col span={10}>
              <div className='ad-section-card-result'>
                <span>24</span> Search results
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
export default Index

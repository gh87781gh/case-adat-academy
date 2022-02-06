import { useState, useEffect, useContext } from 'react'
import { MyContext } from 'storage'
import { useHistory } from 'react-router-dom'
import CourseApi from 'api/user/CourseApi'
import Header from 'view/Header'
import Footer from 'view/user/layout/Footer'
import { Btn } from 'utility/component'
import Card from '../../component/Card'
import { Row, Col, Breadcrumb, Pagination } from 'antd'

const Bookmark = () => {
  const context = useContext(MyContext)
  const api = new CourseApi()
  const history = useHistory()

  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const getBookmarks = (toPage?: number) => {
    const page = toPage ?? 1
    setPage(page)

    context.setIsLoading(true)
    api
      .getBookmarks({ page })
      .then((res: any) => {
        setList(res.data)
        setTotal(res.total)
      })
      .finally(() => context.setIsLoading(false))
  }
  const cancelBookmark = (courseId: string, sectionId: string) => {
    context.setIsLoading(true)
    api
      .cancelBookmark(courseId, sectionId)
      .finally(() => context.setIsLoading(false))
  }

  useEffect(() => {
    getBookmarks()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Header />
      <div className='ad-breadcrumb'>
        <Breadcrumb separator='|'>
          <Breadcrumb.Item onClick={() => history.push('/course')}>
            <Btn feature='link'>Course</Btn>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <b>Bookmark</b>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <article className='ad-page-container'>
        <h1 className='ad-title'>Bookmark</h1>
        <section className='ad-section-card'>
          {list.length > 0 ? (
            <>
              {list.map((card: any, index: number) => (
                <div key={index}>
                  <Card
                    type='BOOKMARK'
                    subtitle={card.course_name}
                    title={card.section_name}
                    text={card.section_content}
                    course_id={card.course_id}
                    section_id={card.section_id}
                    cancelBookmark={() =>
                      cancelBookmark(card.course_id, card.section_id)
                    }
                  />
                </div>
              ))}
              <Row gutter={20}>
                <Col span={10}>
                  <div className='ad-section-list-result'>
                    <span>{list.length}</span> Bookmarks
                  </div>
                </Col>
                <Col span={14} className='ad-text-right'>
                  <Pagination
                    current={page}
                    total={total}
                    onChange={(page: number) => getBookmarks(page)}
                  />
                </Col>
              </Row>
            </>
          ) : null}
        </section>
      </article>
      <Footer />
    </>
  )
}
export default Bookmark

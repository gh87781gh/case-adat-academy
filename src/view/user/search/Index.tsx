import { useState, useEffect, useContext } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { MyContext } from 'storage'
import SearchApi from 'api/user/SearchApi'

import Header from 'view/user/layout/Header'
import Footer from 'view/user/layout/Footer'

import { Btn } from 'utility/component'
import Card from '../component/Card'
import { Row, Col, Pagination } from 'antd'

const Index = () => {
  const context = useContext(MyContext)
  const api = new SearchApi()
  const history = useHistory()
  const { text } = useParams<{ text: string }>()

  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const getSearchResult = (toPage?: number) => {
    const page = toPage ?? 1
    setPage(page)

    context.setIsLoading(true)
    api
      .getSearchResult(text, { page })
      .then((res: any) => {
        if (res.data.length === 0) {
          // TOCHECK no result vs no access?
          history.push('/noResult')
        } else {
          setList(res.data)
          setTotal(res.total)
        }
      })
      .finally(() => context.setIsLoading(false))
  }

  useEffect(() => {
    if (text) getSearchResult()
  }, [text]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Header />
      <article className='ad-page-container'>
        <h1 className='ad-title'>Search result</h1>
        <section className='ad-section-card'>
          {list.length > 0 ? (
            <>
              <div
                className='ad-text-right ad-color-primary'
                style={{ marginBottom: '24px' }}
              >
                Can’t find the solutions? Please visit{' '}
                <Btn feature='link'>help center</Btn>
              </div>
              {list.map((card: any, index: number) => (
                <div key={index}>
                  <Card
                    type='SEARCH'
                    subtitle={card.course_name}
                    title={card.title}
                    text={card.content}
                    course_id={card.course_id}
                    section_id={card.section_id}
                  />
                </div>
              ))}
              <Row gutter={20}>
                <Col span={10}>
                  <div className='ad-section-list-result'>
                    <span>{list.length}</span> Search results
                  </div>
                </Col>
                <Col span={14} className='ad-text-right'>
                  <Pagination
                    current={page}
                    total={total}
                    onChange={(page: number) => getSearchResult(page)}
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
export default Index

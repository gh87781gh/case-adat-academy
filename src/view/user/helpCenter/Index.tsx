import { useState, useEffect, useContext } from 'react'
import { MyContext, StaticService } from 'storage'
import { useHistory } from 'react-router-dom'
import CourseApi from 'api/user/CourseApi'
import Header from 'view/layout/Header'
import Footer from 'view/layout/Footer'
import { Btn } from 'utility/component'
import CS from 'assets/img/temp-cs.jpeg'
import Card from '../component/Card'
import { Row, Col, Breadcrumb, Pagination } from 'antd'

interface IState {
  coursesType: string
}

const HelpCenter = () => {
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
  const renderHelpCenterDesc = () => {
    return (
      <div className='ad-helpCenter-desc'>
        <p>
          We will try to reach you within <b>2</b> working days. Our team
          members are here for you:
        </p>
        <div className='ad-helpCenter-desc-cs'>
          <img src={CS} alt='' />
          <h4>Demmy</h4>
        </div>
        <div className='ad-helpCenter-desc-cs'>
          <img src={CS} alt='' />
          <h4>Violet</h4>
        </div>
        <div className='ad-helpCenter-desc-cs'>
          <img src={CS} alt='' />
          <h4>Aster</h4>
        </div>
      </div>
    )
  }
  return (
    <>
      <Header />
      <article className='ad-page-container'>
        <h1 className='ad-title'>Help center</h1>

        <Row gutter={20}>
          <Col span={8}>
            <div className='ad-helpCenter-card'>
              <h2>Customer training support</h2>
              <ul>
                <li>Account issues</li>
                <li>Course questions</li>
                <li>Operation questions</li>
              </ul>
              <Btn feature='action' onClick={() => history.push('/contactUs')}>
                Contact us
              </Btn>
              <p>
                Or find solutions in <Btn feature='link'>course</Btn>
              </p>
            </div>
          </Col>
          <Col span={16} className='ad-text-right'>
            {renderHelpCenterDesc()}
          </Col>
        </Row>
      </article>
      <Footer />
    </>
  )
}
export default HelpCenter

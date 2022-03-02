import { useState, useEffect, useContext } from 'react'
import { MyContext, StaticService } from 'storage'
import { useHistory } from 'react-router-dom'
import CourseApi from 'api/user/CourseApi'

import Header from 'view/user/layout/Header'
import Footer from 'view/user/layout/Footer'
import LearningPath from './learningPath/LearningPath'
import NoCourse from 'view/user/layout/NoCourse'

import { IconArrowDown, IconBookmark } from 'utility/icon'
import { Btn } from 'utility/component'
import { Row, Col, Select, Pagination, message } from 'antd'
const { Option } = Select

interface IState {
  coursesType: string
}

const Index = () => {
  const context = useContext(MyContext)
  const api = new CourseApi()
  const history = useHistory()

  // init page
  useEffect(() => {
    if (context.auth) {
      message.success('Login successfully')
    } else {
      history.push('/login')
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // data
  const [data, setData] = useState<IState>({
    coursesType: 'courseA'
  })
  const onSelect = (key: string, value: any) => {
    setData({ ...data, [key]: value })
  }

  // list
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const getCoursesByLearningPath = (toPage?: number) => {
    const page = toPage ?? 1
    setPage(page)

    context.setIsLoading(true)
    api
      .getCoursesByLearningPath(data.coursesType, { page })
      .then((res: any) => {
        setList(res.data)
        setTotal(res.total)
      })
      .finally(() => context.setIsLoading(false))
  }
  useEffect(() => {
    getCoursesByLearningPath()
  }, [data.coursesType]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Header />
      <div className='ad-course-banner'>
        <div className='ad-layout-container'>
          <p className='desc'>
            Based on your{' '}
            <Btn
              feature='link'
              onClick={() => history.push('/account/learningProfile')}
            >
              learning profile
            </Btn>
            , we recommend this
          </p>
          <h1 className='title'>
            <span>LEARNING</span> <span>PATH</span>
          </h1>
          <LearningPath />
        </div>
      </div>
      <article>
        <section className='ad-layout-container ad-section ad-section-course'>
          <Row>
            <Col span={20}>
              <div className='ad-clearfix'>
                <div className='ad-form-group ad-form-group-horizontal ad-float-right'>
                  <label>
                    <b>Show</b>
                  </label>
                  <Select
                    style={{ width: '300px' }}
                    value={data.coursesType}
                    placeholder='Please select'
                    suffixIcon={<IconArrowDown />}
                    onChange={(val) => onSelect('coursesType', val)}
                  >
                    <Option value='courseA' key='courseA'>
                      Based on learning path
                    </Option>
                    <Option value='courseB' key='courseB'>
                      All available course
                    </Option>
                  </Select>
                </div>
              </div>
            </Col>
            <Col span={4} style={{ textAlign: 'right' }}>
              <Btn
                feature='secondary'
                onClick={() => history.push('/bookmark')}
              >
                <IconBookmark />
                Bookmark
              </Btn>
            </Col>
          </Row>
          {list.length > 0 ? (
            <>
              <ul className='ad-course-list-group'>
                {list.map((course: any) => (
                  <li className='ad-course-list' key={course.id}>
                    {course.logo_image_id ? (
                      <div className='ad-course-list-img'>
                        <img
                          src={`${StaticService.apiUrl}/archive/${course.logo_image_id}`}
                          alt=''
                        />
                      </div>
                    ) : null}
                    <div className='ad-course-list-content'>
                      <h2>{course.name}</h2>
                      <p>{course.description}</p>
                    </div>
                    <div className='ad-course-list-action'>
                      <Btn
                        className='w-100'
                        feature='primary'
                        disabled={
                          !course.available || course.status === 'Not available'
                        }
                        onClick={() =>
                          history.push(`/courseDetail/${course.id}`)
                        }
                      >
                        Take class
                      </Btn>
                      <small>
                        {course.status === 'Not started' ||
                        course.status === 'Not available' ||
                        course.status === 'All read' ? (
                          <>{course.status}</>
                        ) : course.status === 'In progress' ? (
                          <>
                            <span>{course.last_read_day} DAYS AGO</span> LAST
                            READ
                          </>
                        ) : null}
                      </small>
                    </div>
                  </li>
                ))}
              </ul>
              <Row gutter={20}>
                <Col span={10}>
                  <div className='ad-section-list-result'>
                    <span>{total}</span> courses
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
            </>
          ) : (
            <NoCourse />
          )}
        </section>
      </article>
      <Footer />
    </>
  )
}
export default Index

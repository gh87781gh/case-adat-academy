import { useState, useEffect, useContext, useRef } from 'react'
import { MyContext, StaticService } from 'storage'
import GlobalApi from 'api/GlobalApi'
import CourseApi from 'api/user/CourseApi'
import Header from 'view/layout/Header'
import Footer from 'view/layout/Footer'
import { IconArrowDown, IconBookmark } from 'utility/icon'
import { Btn } from 'utility/component'
import LearningPath from './LearningPath'

import { Button, Row, Col, Select, Pagination } from 'antd'
const { Option } = Select

interface IState {
  coursesType: string
}

const Index = () => {
  const context = useContext(MyContext)
  const api_global = new GlobalApi()
  const api = new CourseApi()

  const [data, setData] = useState<IState>({
    coursesType: 'courseA'
  })
  const onSelect = (key: string, value: any) => {
    setData({ ...data, [key]: value })
  }

  const [list, setList] = useState([
    {
      available: true,
      description: 'Test description',
      id: 'dd0cf1fd-0aa3-406a-8bf0-8cf496f36a32',
      last_read_day: 0,
      logo_image_id: '',
      name: 'Test Course A'
    },
    {
      available: true,
      description: 'Test description',
      id: 'dd0cf1fd-0aa3-406a-8bf0-8cf496f36a32',
      last_read_day: 0,
      logo_image_id: '',
      name: 'Test Course A'
    },
    {
      available: true,
      description: 'Test description',
      id: 'dd0cf1fd-0aa3-406a-8bf0-8cf496f36a32',
      last_read_day: 0,
      logo_image_id: '',
      name: 'Test Course A'
    },
    {
      available: true,
      description: 'Test description',
      id: 'dd0cf1fd-0aa3-406a-8bf0-8cf496f36a32',
      last_read_day: 0,
      logo_image_id: '',
      name: 'Test Course A'
    },
    {
      available: true,
      description: 'Test description',
      id: 'dd0cf1fd-0aa3-406a-8bf0-8cf496f36a32',
      last_read_day: 0,
      logo_image_id: '',
      name: 'Test Course A'
    },
    {
      available: true,
      description: 'Test description',
      id: 'dd0cf1fd-0aa3-406a-8bf0-8cf496f36a32',
      last_read_day: 0,
      logo_image_id: '',
      name: 'Test Course A'
    },
    {
      available: true,
      description: 'Test description',
      id: 'dd0cf1fd-0aa3-406a-8bf0-8cf496f36a32',
      last_read_day: 0,
      logo_image_id: '',
      name: 'Test Course A'
    },
    {
      available: true,
      description: 'Test description',
      id: 'dd0cf1fd-0aa3-406a-8bf0-8cf496f36a32',
      last_read_day: 0,
      logo_image_id: '',
      name: 'Test Course A'
    },
    {
      available: true,
      description: 'Test description',
      id: 'dd0cf1fd-0aa3-406a-8bf0-8cf496f36a32',
      last_read_day: 0,
      logo_image_id: '',
      name: 'Test Course A'
    },
    {
      available: true,
      description: 'Test description',
      id: 'dd0cf1fd-0aa3-406a-8bf0-8cf496f36a32',
      last_read_day: 0,
      logo_image_id: '',
      name: 'Test Course A'
    },
    {
      available: true,
      description: 'Test description',
      id: 'dd0cf1fd-0aa3-406a-8bf0-8cf496f36a32',
      last_read_day: 0,
      logo_image_id: '',
      name: 'Test Course A'
    },
    {
      available: true,
      description: 'Test description',
      id: 'dd0cf1fd-0aa3-406a-8bf0-8cf496f36a32',
      last_read_day: 0,
      logo_image_id: '',
      name: 'Test Course A'
    },
    {
      available: true,
      description: 'Test description',
      id: 'dd0cf1fd-0aa3-406a-8bf0-8cf496f36a32',
      last_read_day: 0,
      logo_image_id: '',
      name: 'Test Course A'
    },
    {
      available: true,
      description: 'Test description',
      id: 'dd0cf1fd-0aa3-406a-8bf0-8cf496f36a32',
      last_read_day: 0,
      logo_image_id: '',
      name: 'Test Course A'
    },
    {
      available: true,
      description: 'Test description',
      id: 'dd0cf1fd-0aa3-406a-8bf0-8cf496f36a32',
      last_read_day: 0,
      logo_image_id: '',
      name: 'Test Course A'
    },
    {
      available: true,
      description: 'Test description',
      id: 'dd0cf1fd-0aa3-406a-8bf0-8cf496f36a32',
      last_read_day: 0,
      logo_image_id: '',
      name: 'Test Course A'
    }
  ])
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
            Based on your <Btn feature='link'>learning profile</Btn>, we
            recommend this
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
              <Btn feature='secondary'>
                <IconBookmark />
                Bookmark
              </Btn>
            </Col>
          </Row>
          <ul className='ad-section-course-list-group'>
            {list.map((course: any) => (
              <li className='ad-section-course-list'>
                <div className='ad-section-course-list-img'>
                  {course.logo_image_id ? (
                    <img
                      src={`${StaticService.apiUrl}/archive/${course.logo_image_id}`}
                      alt=''
                    />
                  ) : null}
                </div>
                <div className='ad-section-course-list-content'>
                  <h2>{course.name}</h2>
                  <p>{course.description}</p>
                </div>
                <div className='ad-section-course-list-action'>
                  <Btn
                    className='w-100'
                    feature='primary'
                    disabled={
                      !course.available || course.status === 'Not available'
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
                        <span>{course.last_read_day} DAYS AGO</span> LAST READ
                      </>
                    ) : null}
                  </small>
                </div>
              </li>
            ))}
          </ul>
          <div className='ad-pagination-box'>
            <Pagination
              current={page}
              total={total}
              onChange={(page: number) => getCoursesByLearningPath(page)}
            />
          </div>
        </section>
      </article>
      <Footer />
    </>
  )
}
export default Index

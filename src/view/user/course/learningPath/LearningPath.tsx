import { useState, useContext, useEffect } from 'react'
import { MyContext, StaticService } from 'storage'
import { useHistory } from 'react-router-dom'
import CourseApi from 'api/user/CourseApi'

import FormatCourseStatus from '../FormatCourseStatus'

import { Btn } from 'utility/component'
import { IconPathHover, IconPathLine, IconPathArrow } from 'utility/icon'

interface IPropsStage {
  stage: any
}

const Stage = (props: IPropsStage) => {
  const history = useHistory()

  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  return (
    <>
      <div className='stage'>
        <p>{props.stage.name}</p>
        <div className='group'>
          {props.stage.courses.map((course: any, index: number, ary: any) => (
            <div
              className='class'
              key={index}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <div className='aa-course-banner-path-status'>
                {index !== hoverIndex ? (
                  <FormatCourseStatus
                    type='ICON'
                    available={course.available}
                    status={course.status}
                  />
                ) : (
                  <IconPathHover />
                )}
                <IconPathLine
                  className='aa-course-banner-path-dashLine'
                  style={{ visibility: ary[index + 1] ? 'visible' : 'hidden' }}
                />
              </div>
              <span>{course.name}</span>
              {index === hoverIndex ? (
                <div className='class-hoverCard'>
                  <div className='logo'>
                    {course.logo_image_id ? (
                      <img
                        src={`${StaticService.apiUrl}/archive/${course.logo_image_id}`}
                        alt=''
                      />
                    ) : null}
                  </div>
                  <div className='info'>
                    <div className='desc'>{course.description}</div>
                    <small>
                      <FormatCourseStatus
                        type='STRING'
                        available={course.available}
                        status={course.status}
                        last_read_day={course.last_read_day}
                      />
                    </small>
                    <Btn
                      feature='primary'
                      className='w-100'
                      disabled={!course.available}
                      onClick={() => history.push(`/courseDetail/${course.id}`)}
                    >
                      Take class
                    </Btn>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
      <IconPathArrow className='next-arrow' />
    </>
  )
}
const LearningPath = () => {
  const context = useContext(MyContext)
  const api = new CourseApi()

  const [data, setData] = useState<any>([])

  useEffect(() => {
    context.setIsLoading(true)
    api
      .getBannerLearningPath()
      .then((res: any) => setData(res.data))
      .finally(() => context.setIsLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='aa-course-banner-path'>
      {data.map((stage: any, index: number) => (
        <Stage stage={stage} key={index} />
      ))}
    </div>
  )
}
export default LearningPath

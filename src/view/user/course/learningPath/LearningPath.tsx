import { useState, useContext, useEffect } from 'react'
import { MyContext, StaticService } from 'storage'
import { useHistory } from 'react-router-dom'
import CourseApi from 'api/user/CourseApi'
import { Btn } from 'utility/component'
import {
  IconPathEmpty,
  IconPathInProgress,
  IconPathCheck,
  IconPathHover,
  IconPathLine,
  IconPathArrow
} from 'utility/icon'

// const fakeData = [
//   {
//     name: 'Stage 1',
//     courses: [
//       {
//         id: '1ca6bc26-f9c8-45f8-8ea1-d5bcc391db27',
//         name: 'Test Course A',
//         logo_image_id: '',
//         description: 'Test description',
//         status: 'All read'
//       },
//       {
//         id: '25bb6b0b-d341-4518-a1b3-2874831d6a21',
//         name: 'Test Course B',
//         logo_image_id: '',
//         description: 'Test description',
//         status: 'In progress'
//       }
//     ]
//   },
//   {
//     name: 'Stage 2',
//     courses: [
//       {
//         id: '1ca6bc26-f9c8-45f8-8ea1-d5bcc391db27123',
//         name: 'Test Course C',
//         logo_image_id: '',
//         description: 'Test description',
//         status: 'All read'
//       },
//       {
//         id: '25bb6b0b-d341-4518-a1b3-2874831d6a215432',
//         name: 'Test Course D',
//         logo_image_id: '',
//         description: 'Test description',
//         status: 'Not started'
//       },
//       {
//         id: '25bb6b0b-d341-4518-a1b3-2874831d6a21234565432',
//         name: 'Test Course E',
//         logo_image_id: '',
//         description: 'Test description',
//         status: 'Not started'
//       }
//     ]
//   }
// ]

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
              <div className='ad-course-banner-path-status'>
                {index !== hoverIndex ? (
                  <>
                    {course.status === 'Not started' ||
                    course.status === 'Not available' ? (
                      <IconPathEmpty />
                    ) : course.status === 'In progress' ? (
                      <IconPathInProgress />
                    ) : course.status === 'All read' ? (
                      <IconPathCheck />
                    ) : null}
                  </>
                ) : (
                  <IconPathHover />
                )}
                <IconPathLine
                  className='ad-course-banner-path-dashLine'
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
                    <small>{course.status}</small>
                    <Btn
                      feature='primary'
                      className='w-100'
                      disabled={
                        !course.available || course.status === 'Not available'
                      }
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
    <div className='ad-course-banner-path'>
      {data.map((stage: any, index: number) => (
        <Stage stage={stage} key={index} />
      ))}
    </div>
  )
}
export default LearningPath

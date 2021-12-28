import { useState, useEffect } from 'react'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import Header from '../../layout/Header'
import Course from './Course'
import CourseDetail from './courseDetail/CourseDetail'
import LearningPath from './learningPath/LearningPath'
import AdminSideBar from '../AdminSideBar'

const Index = () => {
  const { courseId } = useParams<{ courseId: string }>()
  const history = useHistory()
  const location = useLocation()

  const [step, setStep] = useState<number>(0)

  useEffect(() => {
    if (courseId) {
      setStep(1)
    } else {
      setStep(0)
    }
  }, [courseId])

  return (
    <>
      <Header />
      <div className='ad-layout-admin'>
        <AdminSideBar />
        <article>
          {step === 0 ? (
            <Course next={(step: number) => setStep(step)} />
          ) : step === 1 ? (
            <CourseDetail prev={() => history.push('/admin/course')} />
          ) : step === 2 ? (
            <LearningPath prev={() => setStep(0)} />
          ) : null}
        </article>
      </div>
    </>
  )
}
export default Index

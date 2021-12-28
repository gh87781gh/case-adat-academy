import { useState } from 'react'
import Header from '../../layout/Header'
import Course from './course/Course'
import CourseDetail from './courseDetail/CourseDetail'
import LearningPath from './learningPath/LearningPath'
import AdminSideBar from '../AdminSideBar'

const Index = () => {
  const [step, setStep] = useState<number>(0)
  const [courseId, setCourseId] = useState<string>('')

  return (
    <>
      <Header />
      <div className='ad-layout-admin'>
        <AdminSideBar />
        <article>
          {step === 0 ? (
            <Course
              next={(step: number) => setStep(step)}
              setCourseId={(courseId: string) => setCourseId(courseId)}
            />
          ) : step === 1 ? (
            <CourseDetail prev={() => setStep(0)} courseId={courseId} />
          ) : (
            <LearningPath prev={() => setStep(0)} />
          )}
        </article>
      </div>
    </>
  )
}
export default Index

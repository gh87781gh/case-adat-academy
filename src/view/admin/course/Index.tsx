import { useState } from 'react'
import Header from '../../layout/Header'
import Course from './Course'
import CourseDetail from './CourseDetail'
import LearningPath from './LearningPath'
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
            <Course next={(step: number) => setStep(step)} />
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

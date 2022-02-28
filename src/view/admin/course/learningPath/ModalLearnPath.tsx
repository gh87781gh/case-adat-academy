import { useState, useContext, useEffect } from 'react'
import { MyContext } from 'storage'
import CourseApi from 'api/admin/CourseApi'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import Path from './Path'

import { FormGroupMsg, Btn } from 'utility/component'
import { Modal } from 'antd'

interface IProps {
  isShow: boolean
  onCancel: () => void
  getList: () => void
  learningGoal: string
}
interface IPath {
  level: number
  key: string
  name: string
  index: number
  id?: string
  enable?: boolean
}

const ModalLearnPath = (props: IProps) => {
  const context = useContext(MyContext)
  const api = new CourseApi()

  // earning path info
  // const getLearningPathInfo = () => {
  //   context.setIsLoading(true)
  //   api
  //     .getLearningPathInfo(props.learningGoal)
  //     .then((ary: any) => console.log('getLearnGoalDetail:', ary))
  //     .finally(() => context.setIsLoading(false))
  // }

  // earning path detail
  const [path, setPath] = useState<IPath[]>([]) //TODO 待研究
  const getLearningPathDetail = () => {
    context.setIsLoading(true)
    api
      .getLearningPathDetail(props.learningGoal)
      .then((ary: any) => setPath(ary))
      .finally(() => context.setIsLoading(false))
  }

  // course list
  const [courseMenu, setCourseMenu] = useState<any>([])
  const getLearningPathCourseList = () => {
    context.setIsLoading(true)
    api
      .getLearningPathCourseList()
      .then((res: any) => setCourseMenu(res.data))
      .finally(() => context.setIsLoading(false))
  }

  // add level 1
  let [addLevel1Count, setAddLevelACount] = useState<number>(0)

  // const getLearningPathDetail = () => {
  //   context.setIsLoading(true)
  //   api
  //     .getLearnPathGoalCourses(props.learningGoal)
  //     .then((ary: any) => setCourseMenu(ary))
  //     .finally(() => context.setIsLoading(false))
  // }

  // const [selectedCourseMenu, setSelectedCourseMenu] = useState<any>([])
  // useEffect(() => {
  //   const selectedCourses: any = []
  //   for (const el of path) {
  //     if (el.level === 2) selectedCourses.push(el)
  //   }
  //   setSelectedCourseMenu(selectedCourses)
  // }, [path]) // eslint-disable-line react-hooks/exhaustive-deps

  // init modal
  useEffect(() => {
    if (props.isShow && props.learningGoal) {
      getLearningPathDetail()
      getLearningPathCourseList()
    } else {
      setPath([])
    }
  }, [props.isShow]) // eslint-disable-line react-hooks/exhaustive-deps

  const upload = () => {
    context.setIsLoading(true)
    api
      .uploadLearningPathGoalPath(props.learningGoal, path)
      .then(() => props.onCancel())
      .finally(() => context.setIsLoading(false))
  }

  return (
    <Modal
      title='Edit'
      visible={props.isShow}
      onCancel={props.onCancel}
      width={1100}
      footer={[
        <Btn key='Upload' feature='action' onClick={() => upload()}>
          Upload
        </Btn>,
        <Btn key='Reset' feature='primary' onClick={props.onCancel}>
          Reset
        </Btn>
      ]}
    >
      <div className='ad-form-group ad-form-group-horizontal'>
        <label>learning goal</label>
        <div className='ad-form-group-value'>{props.learningGoal}</div>
      </div>
      <FormGroupMsg
        isShow={true}
        isShowIcon={true}
        type='error'
        msg='Course is in inactive status, so user won’t see it'
      />
      <DndProvider backend={HTML5Backend}>
        <Path
          type='LEARNING_PATH'
          path={path}
          courseMenu={courseMenu}
          // selectedCourseMenu={selectedCourseMenu}
          setPath={(path: any) => setPath(path)}
          addLevel1Count={addLevel1Count}
        />
      </DndProvider>
      <div
        className='ad-course-menu-addGroup'
        onClick={() => setAddLevelACount(addLevel1Count + 1)}
      >
        <span>
          <em></em>
          <em></em>
        </span>
      </div>
    </Modal>
  )
}
export default ModalLearnPath

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

  // add level 1
  let [addLevel1Count, setAddLevelACount] = useState<number>(0)

  // add level 2 / course list
  const [courseMenu, setCourseMenu] = useState<any>([])
  const [selectedCourseMenu, setSelectedCourseMenu] = useState<any>([])
  const getLearningPathCourseList = () => {
    context.setIsLoading(true)
    api
      .getLearningPathCourseList()
      .then((res: any) => setCourseMenu(res.data))
      .finally(() => context.setIsLoading(false))
  }
  const handleSelectedCourseMenu = () => {
    const ary: any = [...path]
    const menu: any = []
    for (const item of ary) {
      if (item.level === 2) {
        menu.push(item)
      }
    }
    setSelectedCourseMenu(menu)
  }
  useEffect(() => {
    handleSelectedCourseMenu()
  }, [path]) // eslint-disable-line react-hooks/exhaustive-deps

  // init modal
  useEffect(() => {
    if (props.isShow && props.learningGoal) {
      getLearningPathDetail()
      getLearningPathCourseList()
    } else {
      setPath([])
    }
  }, [props.isShow]) // eslint-disable-line react-hooks/exhaustive-deps

  // api
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
      <div className='aa-form-group aa-form-group-horizontal'>
        <label>learning goal</label>
        <div className='aa-form-group-value'>{props.learningGoal}</div>
      </div>
      <FormGroupMsg
        isShow={true}
        isShowIcon={true}
        type='error'
        msg='Course is in inactive status, so user won’t see it'
      />
      <DndProvider backend={HTML5Backend}>
        <Path
          path={path}
          setPath={(path: any) => setPath(path)}
          courseMenu={courseMenu}
          selectedCourseMenu={selectedCourseMenu}
          addLevel1Count={addLevel1Count}
        />
      </DndProvider>
      <div
        className='aa-course-menu-addGroup'
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

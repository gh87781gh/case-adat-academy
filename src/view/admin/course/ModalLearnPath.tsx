import { useState, useContext, useEffect } from 'react'
import { MyContext } from 'storage'
import CourseApi from 'api/admin/CourseApi'
import FormGroupMsg from 'utility/component/FormGroupMsg'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Menu from './courseDetail/Menu'
import { Button, Input, Modal } from 'antd'

interface IProps {
  isShow: boolean
  onCancel: () => void
  getList: () => void
  learningGoal: string
}
interface IState {}

const ModalLearnPath = (props: IProps) => {
  const context = useContext(MyContext)
  const api = new CourseApi()

  const [courseMenu, setCourseMenu] = useState<any>([])
  const [selectedCourseMenu, setSelectedCourseMenu] = useState<any>([])
  let [addLevelACount, setAddLevelACount] = useState<number>(0)
  const [menu, setMenu] = useState<any>([])
  const getData = async () => {
    context.setIsLoading(true)
    await api
      .getLearnGoalDetail(props.learningGoal)
      .then((ary: any) => {
        setMenu(ary)
      })
      .finally(() => context.setIsLoading(false))
    await api
      .getLearnCourses()
      .then((ary: any) => {
        setCourseMenu(ary)
      })
      .finally(() => context.setIsLoading(false))
  }
  useEffect(() => {
    const selectedCourses: any = []
    for (const el of menu) {
      if (el.level === 'B') selectedCourses.push(el)
    }
    setSelectedCourseMenu(selectedCourses)
  }, [menu]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (props.isShow && props.learningGoal) {
      getData()
    } else {
      setMenu([])
    }
  }, [props.isShow]) // eslint-disable-line react-hooks/exhaustive-deps

  const submit = () => {
    context.setIsLoading(true)

    // if (props.courseId) {
    //   api
    //     .editCourse(props.courseId, data)
    //     .then(() => {
    //       props.getList(true)
    //       props.onCancel()
    //     })
    //     .finally(() => context.setIsLoading(false))
    // } else {
    //   api
    //     .createCourse(data)
    //     .then(() => {
    //       props.getList()
    //       props.onCancel()
    //     })
    //     .finally(() => context.setIsLoading(false))
    // }
  }

  return (
    <Modal
      title='Edit'
      visible={props.isShow}
      onCancel={props.onCancel}
      width={1100}
      footer={[
        <Button key='Upload' type='primary' onClick={() => submit()}>
          Upload
        </Button>,
        <Button key='Reset' onClick={props.onCancel}>
          Reset
        </Button>
      ]}
    >
      <div className='ad-form-group ad-form-group-horizontal'>
        <label>learning goal</label>
        <div className='ad-form-group-value'>{props.learningGoal}</div>
      </div>
      <FormGroupMsg
        isShow={true}
        withIcon={true}
        type='error'
        msg='Course is in inactive status, so user won’t see it'
      />
      <DndProvider backend={HTML5Backend}>
        <Menu
          type='LEARNING_PATH'
          menu={menu}
          courseMenu={courseMenu}
          selectedCourseMenu={selectedCourseMenu}
          setMenu={(menu: any) => setMenu(menu)}
          addLevelACount={addLevelACount}
        />
      </DndProvider>
      <div
        className='ad-course-menu-addGroup'
        onClick={() => setAddLevelACount(addLevelACount + 1)}
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

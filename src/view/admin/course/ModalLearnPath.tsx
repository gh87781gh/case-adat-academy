import { useState, useContext, useEffect } from 'react'
import { MyContext } from 'storage'
import CourseApi from 'api/admin/CourseApi'
import { ValidateStr } from 'utility/validate'
import UploadImg from 'utility/component/UploadImg'
import FormGroupMsg from 'utility/component/FormGroupMsg'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Menu from './courseDetail/Menu'
import { Row, Col, Button, Input, Modal } from 'antd'
const { TextArea } = Input

interface IProps {
  isShow: boolean
  onCancel: () => void
  getList: () => void
  learningGoal: string
}
interface IState {
  name: string
  description: string
  logo_image_id: string
  background_image_id: string
}

const ModalLearnPath = (props: IProps) => {
  const context = useContext(MyContext)
  const api = new CourseApi()

  const initData = {
    name: '',
    description: '',
    logo_image_id: '',
    background_image_id: ''
  }
  const [data, setData] = useState<IState>({ ...initData })
  const onChange = (key: string, e: any) => {
    const value = e.target.value
    if (value) {
      switch (key) {
        case 'name':
        case 'description':
          if (value && ValidateStr('isSymbol', value)) return false
          break
      }
    }
    setData({ ...data, [key]: value })
  }
  const onUpload = (key: string, value: string) => {
    setData({ ...data, [key]: value })
  }

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

  const [courseMenu, setCourseMenu] = useState<any>([])
  const [selectedCourseMenu, setSelectedCourseMenu] = useState<any>([])
  const [menu, setMenu] = useState<any>([])
  const addChild = (clickItem?: any, course?: any) => {
    const ary: any = [...menu]
    let lastDownLevelChildId: string = ''
    let insertIndex: number | null = null
    // TODO 刪除完要重順所有的 key，有搬動後也要，不然會有bug

    switch (clickItem?.level) {
      case 'A':
        for (let i = clickItem.index + 1; i < ary.length; i++) {
          if (ary[i].key.split('-')[0] === clickItem.key) {
            if (ary[i].level === 'B') lastDownLevelChildId = ary[i].key
          } else {
            insertIndex = i
            break
          }
        }
        ary.splice(insertIndex ?? ary.length, 0, {
          level: 'B',
          key: lastDownLevelChildId
            ? `${clickItem.key}-${
                Number(lastDownLevelChildId.split('-')[1]) + 1
              }`
            : `${clickItem.key}-1`,
          id: course.id,
          text: course.name,
          isShowChildren: null,
          isShow: true
        })
        break
      default:
        const stages = menu.filter((item: any) => item.level === 'A')
        ary.push({
          level: 'A',
          key: `${stages.length + 1}`,
          text: 'stage name',
          isShowChildren: null,
          isShow: true
        })
    }
    setMenu(ary)
  }
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

  return (
    <Modal
      title='Edit'
      visible={props.isShow}
      onCancel={props.onCancel}
      width={1100}
      footer={[
        <Button
          key='Upload'
          type='primary'
          disabled={!data.name || !data.description}
          onClick={() => submit()}
        >
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
          addChild={(clickItem: any, course?: any) =>
            addChild(clickItem, course)
          }
        />
      </DndProvider>
      <div className='ad-course-menu-addGroup' onClick={() => addChild()}>
        <span>
          <em></em>
          <em></em>
        </span>
      </div>
    </Modal>
  )
}
export default ModalLearnPath

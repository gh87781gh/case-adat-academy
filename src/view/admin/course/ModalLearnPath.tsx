import { useState, useContext, useEffect } from 'react'
import { MyContext } from 'storage'
import CourseApi from 'api/admin/CourseApi'
import { ValidateStr } from 'utility/validate'
import UploadImg from 'utility/component/UploadImg'
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

  const [menu, setMenu] = useState<any>([])

  // TODO 要處理 extra 功能
  const addChild = (clickItem?: any) => {
    const ary: any = [...menu]
    let lastDownLevelChildId: string = ''
    let insertIndex: number | null = null

    switch (clickItem?.level) {
      case 'group':
        ary[clickItem.index].isShowChildren = true
        for (let i = clickItem.index + 1; i < ary.length; i++) {
          if (ary[i].id.split('-')[0] === clickItem.id) {
            if (ary[i].level === 'chapter') lastDownLevelChildId = ary[i].id
          } else {
            insertIndex = i
            break
          }
        }
        ary.splice(insertIndex ?? ary.length, 0, {
          level: 'chapter',
          id: lastDownLevelChildId
            ? `${clickItem.id}-${
                Number(lastDownLevelChildId.split('-')[1]) + 1
              }`
            : `${clickItem.id}-1`,
          text: 'chapter name',
          isShowChildren: null,
          isShow: true
        })
        break
      case 'chapter':
        ary[clickItem.index].isShowChildren = true
        for (let i = clickItem.index + 1; i < ary.length; i++) {
          if (
            `${ary[i].id.split('-')[0]}-${ary[i].id.split('-')[1]}` ===
            clickItem.id
          ) {
            if (ary[i].level === 'section') lastDownLevelChildId = ary[i].id
          } else {
            insertIndex = i
            break
          }
        }
        ary.splice(insertIndex ?? ary.length, 0, {
          level: 'section',
          id: lastDownLevelChildId
            ? `${clickItem.id}-${
                Number(lastDownLevelChildId.split('-')[2]) + 1
              }`
            : `${clickItem.id}-1`,
          text: 'chapter name',
          isShowChildren: null,
          isShow: true
        })
        break
      default:
        const groups = menu.filter((item: any) => item.level === 'group')
        ary.push({
          level: 'group',
          id: `${groups.length + 1}`,
          text: 'group name',
          isShowChildren: null,
          isShow: true,
          children: []
        })
    }
    setMenu(ary)
  }
  useEffect(() => {
    if (props.isShow) {
      if (props.learningGoal) {
        api
          .getLearnGoalDetail(props.learningGoal)
          .then((ary: any) => {
            setMenu(ary)
          })
          .finally(() => context.setIsLoading(false))
      } else {
        setMenu([])
      }
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
      <Row gutter={20}>
        <Col span={12}>
          <div className='ad-form-group ad-form-group-horizontal'>
            <label>learning goal</label>
            <div className='ad-form-group-value'>{props.learningGoal}</div>
          </div>
          {/* TODO */}
          Course is in inactive status, so user won’t see it
        </Col>
      </Row>
      <DndProvider backend={HTML5Backend}>
        <Menu
          menu={menu}
          setMenu={(menu: any) => setMenu(menu)}
          addChild={(clickItem: any) => addChild(clickItem)}
        />
      </DndProvider>
    </Modal>
  )
}
export default ModalLearnPath

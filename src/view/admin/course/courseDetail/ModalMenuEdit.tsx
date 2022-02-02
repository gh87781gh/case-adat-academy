import { useCallback, useState, useEffect, useContext } from 'react'
import { MyContext } from 'storage'
import CourseApi from 'api/admin/CourseApi'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import CourseDetailMenu from './Menu'

import { Btn, FormGroupMsg } from 'utility/component'
import { Modal } from 'antd'

interface IProps {
  isShow: boolean
  onCancel: () => void
  courseId: string
  getCourseDetailMenu: () => void
}

const ModalMenuEdit = (props: IProps) => {
  const context = useContext(MyContext)
  const api = new CourseApi()

  // course detail menu for edit
  let [addLevel1Count, setAddLevelACount] = useState<number>(0)
  const [menu, setMenu] = useState<any>([])
  const [isLevelRight, setIsLevelRight] = useState<boolean>(true)
  const checkMenuLevelSort = () => {
    let levelRight: boolean = true
    menu.forEach((item: any, index: number, ary: any) => {
      const levelPrev = ary[index - 1]?.level
      const levelNow = item.level
      const levelNext = ary[index + 1]?.level
      switch (levelNow) {
        case 1:
          if (!levelNext || levelNext !== 2) levelRight = false
          break
        case 2:
          if (!levelNext || levelNext !== 3) levelRight = false
          break
        case 3:
          if (!levelPrev) levelRight = false
          break
      }
    })
    setIsLevelRight(levelRight)
  }
  useEffect(() => {
    checkMenuLevelSort()
  }, [menu]) // eslint-disable-line react-hooks/exhaustive-deps

  const save = () => {
    context.setIsLoading(true)
    api
      .editCourseDetailMenu(props.courseId, menu)
      .then(() => {
        props.onCancel()
        props.getCourseDetailMenu()
      })
      .finally(() => context.setIsLoading(false))
  }

  useEffect(() => {
    if (props.isShow) {
      context.setIsLoading(true)
      api
        .getCourseDetailMenu('EDIT', props.courseId)
        .then((res: any) => {
          setMenu(res.data)
        })
        .finally(() => context.setIsLoading(false))
    }
  }, [props.isShow]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Modal
      zIndex={1001}
      title='Edit course menu'
      visible={props.isShow}
      onCancel={() => props.onCancel()}
      width={720}
      footer={[
        <Btn
          key='Save'
          feature='action'
          disabled={!isLevelRight}
          onClick={() => save()}
        >
          Save
        </Btn>,
        <Btn key='Cancel' feature='primary' onClick={() => props.onCancel()}>
          Cancel
        </Btn>
      ]}
    >
      <div style={{ maxWidth: '500px' }}>
        <div style={{ border: isLevelRight ? 'unset' : '1px solid red' }}>
          <DndProvider backend={HTML5Backend}>
            <CourseDetailMenu
              type='COURSE_MENU'
              menu={menu}
              setMenu={(menu: any) => setMenu(menu)}
              addLevel1Count={addLevel1Count}
            />
          </DndProvider>
        </div>
        <div
          className='ad-course-menu-addGroup'
          onClick={() => setAddLevelACount(addLevel1Count + 1)}
        >
          <span>
            <em></em>
            <em></em>
          </span>
        </div>
      </div>
      <FormGroupMsg
        isShow={!isLevelRight}
        isShowIcon={true}
        type='error'
        msg='The level of items have something wrong!'
      />
    </Modal>
  )
}
export default ModalMenuEdit

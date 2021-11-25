import { useCallback, useState, useEffect } from 'react'
import MenuItem from './MenuItem'
import update from 'immutability-helper'
import { Button, Modal } from 'antd'

interface IProps {
  type: string // COURSE_MENU , LEARNING_PATH
  menu: any
  courseMenu?: any
  selectedCourseMenu?: any
  setMenu: (menu: any) => void
  addLevelACount: number
}

const Menu = (props: IProps) => {
  const [draggingItem, setDraggingItem] = useState<any>(null)
  const [dropTargetItem, setDropTargetItem] = useState<any>(null)
  const [deleteItemCache, setDeleteItemCache] = useState<any>(null)
  const [isModalConfirmShow, setIsModalConfirmShow] = useState<boolean>(false)

  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      // console.warn('moveCard:', dragIndex, hoverIndex)
      setDropTargetItem(props.menu[hoverIndex])
      const dragCard = props.menu[dragIndex]
      props.setMenu(
        update(props.menu, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard]
          ]
        })
      )
    },
    [props.menu]
  )
  const startDragging = (item: any) => {
    // console.warn('startDragging')
    setDraggingItem(item)
  }
  const endDragging = () => {
    // console.warn('endDragging')
    // console.warn('draggingItem:', draggingItem)
    // console.warn('dropTargetItem:', dropTargetItem)

    // if level is 'C', there is no children need to be handle
    // if translate is not working, no need to handle children
    if (draggingItem === null || dropTargetItem === null) {
      setDraggingItem(null)
      return
    }

    let ary: any = []

    // 調整 drag/drop 的 children
    if (draggingItem.level === 'A' || draggingItem.level === 'B') {
      // after translate items succeed, filter children of drag item and drop item
      const dragChildren: any = []
      const dropChildren: any = []
      const dragKey: string = draggingItem.key
      const dropKey: string = dropTargetItem.key
      for (const item of props.menu) {
        const parentId: string =
          draggingItem.level === 'A'
            ? item.key.split('-')[0]
            : `${item.key.split('-')[0]}-${item.key.split('-')[1]}`
        if (item.level === draggingItem.level) {
          ary.push(item)
        } else {
          if (parentId === dragKey) {
            dragChildren.push(item)
          } else if (parentId === dropKey) {
            dropChildren.push(item)
          } else {
            ary.push(item)
          }
        }
      }
      //  insert children of drag item and drop item into new menu
      const insertDragChildrenIndex: number = ary.findIndex(
        (item: any) => item.key === dragKey
      )
      ary.splice(insertDragChildrenIndex + 1, 0, ...dragChildren)
      const insertDropChildrenIndex: number = ary.findIndex(
        (item: any) => item.key === dropKey
      )
      ary.splice(insertDropChildrenIndex + 1, 0, ...dropChildren)
    } else {
      ary = [...props.menu]
    }

    let indexA: number = 0
    let indexB: number = 0
    let indexC: number = 0
    ary.forEach((item: any, index: number) => {
      switch (item.level) {
        case 'A':
          if (indexA !== 0) {
            indexB = 0
            indexC = 0
          }
          indexA++
          item.key = `${indexA}`
          break
        case 'B':
          indexB++
          item.key = `${indexA}-${indexB}`
          break
        case 'C':
          indexC++
          item.key = `${indexA}-${indexB}-${indexC}`
          break
      }
    })

    props.setMenu(ary)
    setDraggingItem(null)
  }
  const expandChildren = (item: any) => {
    const ary = [...props.menu]
    ary[item.index].isShowChildren = !ary[item.index].isShowChildren
    for (const el of ary) {
      const parentId: string =
        item.level === 'A'
          ? el.key.split('-')[0]
          : `${el.key.split('-')[0]}-${el.key.split('-')[1]}`

      if (
        (item.level === 'A' && item.key === parentId) ||
        (item.level === 'B' && el.key !== parentId && parentId === item.key)
      )
        el.isShow = !item.isShowChildren
    }
    props.setMenu(ary)
  }
  const rename = (index: number, value: string) => {
    const newMenu = [...props.menu]
    newMenu[index].text = value
    props.setMenu(newMenu)
  }
  const handleDeleteItem = (item: any) => {
    switch (item.level) {
      case 'A':
      case 'B':
        const isHasChildren = props.menu.find((el: any) => {
          let checkPrefix: string =
            item.level === 'A'
              ? el.key.split('-')[0]
              : `${el.key.split('-')[0]}-${el.key.split('-')[1]}`
          return item.level === 'A'
            ? checkPrefix === item.key && el.level === 'B'
            : checkPrefix === item.key && el.level === 'C'
        })
        isHasChildren ? setDeleteItemCache(item) : deleteItem(item)
        break
      case 'C':
        deleteItem(item)
        break
      default:
    }
  }
  const deleteItem = (item: any) => {
    const level: string = item.level

    // create new menu without deleted item
    const ary: any = props.menu.filter((el: any) => {
      const prefix: string =
        level === 'A'
          ? el.key.split('-')[0]
          : level === 'B'
          ? `${el.key.split('-')[0]}-${el.key.split('-')[1]}`
          : el.key
      if (prefix !== item.key) return el
    })

    // handle parent item's expanding arrow
    if (level === 'B' || level === 'C') {
      const parentId: string =
        level === 'B'
          ? item.key.split('-')[0]
          : `${item.key.split('-')[0]}-${item.key.split('-')[1]}`
      const isHasChildren = ary.find((el: any) => {
        const prefix: string =
          level === 'B'
            ? el.key.split('-')[0]
            : `${el.key.split('-')[0]}-${el.key.split('-')[1]}`
        return el.level === level && prefix === parentId
      })
      if (!isHasChildren) {
        const parentIndex = ary.findIndex((el: any) => el.key === parentId)
        ary[parentIndex].isShowChildren = null
      }
    }

    setDeleteItemCache(null)
    props.setMenu(ary)
  }
  const addChild = (clickItem?: any, course?: any) => {
    const ary: any = [...props.menu]
    let lastDownLevelChildId: string = ''
    let insertIndex: number | null = null

    switch (clickItem?.level) {
      case 'A':
        ary[clickItem.index].isShowChildren = true
        for (let i = clickItem.index + 1; i < ary.length; i++) {
          if (ary[i].key.split('-')[0] === clickItem.key) {
            if (ary[i].level === 'B') lastDownLevelChildId = ary[i].key
          } else {
            insertIndex = i
            break
          }
        }
        const el =
          props.type === 'COURSE_MENU'
            ? {
                level: 'B',
                key: lastDownLevelChildId
                  ? `${clickItem.key}-${
                      Number(lastDownLevelChildId.split('-')[1]) + 1
                    }`
                  : `${clickItem.key}-1`,
                text: 'chapter name',
                isShowChildren: null,
                isShow: true
              }
            : props.type === 'LEARNING_PATH'
            ? {
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
              }
            : {}
        ary.splice(insertIndex ?? ary.length, 0, el)
        break
      case 'B':
        ary[clickItem.index].isShowChildren = true
        for (let i = clickItem.index + 1; i < ary.length; i++) {
          if (
            `${ary[i].key.split('-')[0]}-${ary[i].key.split('-')[1]}` ===
            clickItem.key
          ) {
            if (ary[i].level === 'C') lastDownLevelChildId = ary[i].key
          } else {
            insertIndex = i
            break
          }
        }
        ary.splice(insertIndex ?? ary.length, 0, {
          level: 'C',
          key: lastDownLevelChildId
            ? `${clickItem.key}-${
                Number(lastDownLevelChildId.split('-')[2]) + 1
              }`
            : `${clickItem.key}-1`,
          text: 'chapter name',
          isShowChildren: null,
          isShow: true
        })
        break
      default:
        const itemsA = props.menu.filter((item: any) => item.level === 'A')
        ary.push({
          level: 'A',
          key: `${itemsA.length + 1}`,
          text: 'group name',
          isShowChildren: null,
          isShow: true
        })
    }
    props.setMenu(ary)
  }
  useEffect(() => {
    if (deleteItemCache) setIsModalConfirmShow(true)
  }, [deleteItemCache])
  useEffect(() => {
    if (props.addLevelACount !== 0) addChild()
  }, [props.addLevelACount])

  return (
    <>
      <div className='ad-course-menu'>
        {props.menu.map((item: any, index: number) => {
          return (
            <div key={item.key}>
              <MenuItem
                type={props.type}
                menu={props.menu}
                courseMenu={props.courseMenu}
                selectedCourseMenu={props.selectedCourseMenu}
                item={{ ...item, index }}
                moveCard={(dragIndex: number, hoverIndex: number) =>
                  moveCard(dragIndex, hoverIndex)
                }
                addChild={(clickItem: any, course?: any) =>
                  addChild(clickItem, course)
                }
                startDragging={(item: any) => startDragging(item)}
                isInDragging={draggingItem !== null}
                endDragging={() => endDragging()}
                expandChildren={(item: any) => expandChildren(item)}
                rename={(index: number, value: string) => rename(index, value)}
                handleDeleteItem={(item: any) => handleDeleteItem(item)}
              />
            </div>
          )
        })}
      </div>
      <Modal
        title='Are you sure?'
        visible={isModalConfirmShow}
        onCancel={() => setIsModalConfirmShow(false)}
        footer={[
          <Button
            key='Create'
            type='primary'
            onClick={() => {
              deleteItem(deleteItemCache)
              setIsModalConfirmShow(false)
            }}
          >
            Yes. Delete it.
          </Button>,
          <Button key='Cancel' onClick={() => setIsModalConfirmShow(false)}>
            No
          </Button>
        ]}
        width={720}
      >
        There are {deleteItemCache?.level === 'A' ? 'chapters' : 'secitons'} in
        the folders. Are you sure you want to delete all the content?
      </Modal>
    </>
  )
}
export default Menu

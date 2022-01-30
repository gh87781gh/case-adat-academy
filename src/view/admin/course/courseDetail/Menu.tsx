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
  addLevel1Count: number
  goToSection?: (index: number) => void
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
    [props.menu] // eslint-disable-line react-hooks/exhaustive-deps
  )
  const startDragging = (item: any) => {
    // console.warn('startDragging')
    setDraggingItem(item)
  }
  const endDragging = () => {
    // console.warn('endDragging')
    // console.warn('draggingItem:', draggingItem)
    // console.warn('dropTargetItem:', dropTargetItem)

    // if level is 3, there is no children need to be handle
    // if translate is not working, no need to handle children
    if (draggingItem === null || dropTargetItem === null) {
      setDraggingItem(null)
      return
    }

    let ary: any = []

    // 調整 drag/drop 的 children
    if (draggingItem.level === 1 || draggingItem.level === 2) {
      // after translate items succeed, filter children of drag item and drop item
      const dragChildren: any = []
      const dropChildren: any = []
      const dragKey: string = draggingItem.key
      const dropKey: string = dropTargetItem.key
      for (const item of props.menu) {
        const parentId: string =
          draggingItem.level === 1
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

    props.setMenu(resortKeys(ary))
    setDraggingItem(null)
  }
  const resortKeys = (array: any) => {
    let indexA: number = 0
    let indexB: number = 0
    let indexC: number = 0
    array.forEach((item: any, index: number) => {
      switch (item.level) {
        case 1:
          if (indexA !== 0) {
            indexB = 0
            indexC = 0
          }
          indexA++
          item.key = `${indexA}`
          break
        case 2:
          indexB++
          item.key = `${indexA}-${indexB}`
          break
        case 3:
          indexC++
          item.key = `${indexA}-${indexB}-${indexC}`
          break
      }
    })
    return array
  }
  const expandChildren = (item: any) => {
    const ary = [...props.menu]
    ary[item.index].isShowChildren = !ary[item.index].isShowChildren
    for (const el of ary) {
      const parentId: string =
        item.level === 1
          ? el.key.split('-')[0]
          : `${el.key.split('-')[0]}-${el.key.split('-')[1]}`

      if (
        (item.level === 1 && item.key === parentId) ||
        (item.level === 2 && el.key !== parentId && parentId === item.key)
      )
        el.isShow = !item.isShowChildren
    }
    props.setMenu(ary)
  }
  const rename = (index: number, value: string) => {
    const newMenu = [...props.menu]
    newMenu[index].name = value
    props.setMenu(newMenu)
  }
  const handleDeleteItem = (item: any) => {
    switch (item.level) {
      case 1:
      case 2:
        const isHasChildren = props.menu.find((el: any) => {
          let checkPrefix: string =
            item.level === 1
              ? el.key.split('-')[0]
              : `${el.key.split('-')[0]}-${el.key.split('-')[1]}`
          return item.level === 1
            ? checkPrefix === item.key && el.level === 2
            : checkPrefix === item.key && el.level === 3
        })
        isHasChildren ? setDeleteItemCache(item) : deleteItem(item)
        break
      case 3:
        deleteItem(item)
        break
      default:
    }
  }
  const deleteItem = (item: any) => {
    const level: number = item.level

    // create new menu without deleted item
    const ary: any = props.menu.filter((el: any) => {
      const prefix: string =
        level === 1
          ? el.key.split('-')[0]
          : level === 2
          ? `${el.key.split('-')[0]}-${el.key.split('-')[1]}`
          : el.key
      if (prefix !== item.key) {
        return el
      } else {
        return false //TOCHECK
      }
    })
    console.log('TOCHECK ary:', ary)

    // handle parent item's expanding arrow
    if (level === 2 || level === 3) {
      const parentId: string =
        level === 2
          ? item.key.split('-')[0]
          : `${item.key.split('-')[0]}-${item.key.split('-')[1]}`
      const isHasChildren = ary.find((el: any) => {
        const prefix: string =
          level === 2
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
    props.setMenu(resortKeys(ary))
  }
  const addChild = (clickItem?: any, course?: any) => {
    const ary: any = [...props.menu]
    let lastDownLevelChildId: string = ''
    let insertIndex: number | null = null

    switch (clickItem?.level) {
      case 1:
        // add level 2
        ary[clickItem.index].isShowChildren = true
        for (let i = clickItem.index + 1; i < ary.length; i++) {
          if (ary[i].key.split('-')[0] === clickItem.key) {
            if (ary[i].level === 2) lastDownLevelChildId = ary[i].key
          } else {
            insertIndex = i
            break
          }
        }
        const itemB =
          props.type === 'COURSE_MENU'
            ? {
                level: 2,
                key: lastDownLevelChildId
                  ? `${clickItem.key}-${
                      Number(lastDownLevelChildId.split('-')[1]) + 1
                    }`
                  : `${clickItem.key}-1`,
                name: 'chapter name',
                isShowChildren: null,
                isShow: true
              }
            : props.type === 'LEARNING_PATH'
            ? {
                level: 2,
                key: lastDownLevelChildId
                  ? `${clickItem.key}-${
                      Number(lastDownLevelChildId.split('-')[1]) + 1
                    }`
                  : `${clickItem.key}-1`,
                id: course.id,
                name: course.name,
                isShowChildren: null,
                isShow: true
              }
            : {}
        ary.splice(insertIndex ?? ary.length, 0, itemB)
        break
      case 2:
        // add level 3
        // only in props.type : COURSE_MENU
        ary[clickItem.index].isShowChildren = true
        for (let i = clickItem.index + 1; i < ary.length; i++) {
          if (
            `${ary[i].key.split('-')[0]}-${ary[i].key.split('-')[1]}` ===
            clickItem.key
          ) {
            if (ary[i].level === 3) lastDownLevelChildId = ary[i].key
          } else {
            insertIndex = i
            break
          }
        }
        ary.splice(insertIndex ?? ary.length, 0, {
          level: 3,
          key: lastDownLevelChildId
            ? `${clickItem.key}-${
                Number(lastDownLevelChildId.split('-')[2]) + 1
              }`
            : `${clickItem.key}-1`,
          name: 'section name',
          isShowChildren: null,
          isShow: true
        })
        break
      default:
        // add level 1
        const itemsA = props.menu.filter((item: any) => item.level === 1)
        const itemA =
          props.type === 'COURSE_MENU'
            ? {
                level: 1,
                key: `${itemsA.length + 1}`,
                name: 'group name',
                isShowChildren: null,
                isShow: true
              }
            : props.type === 'LEARNING_PATH'
            ? {
                level: 1,
                key: `${itemsA.length + 1}`,
                name: `Stage ${itemsA.length + 1}`,
                isShowChildren: null,
                isShow: true
              }
            : {}
        ary.push(itemA)
    }
    props.setMenu(ary)
  }
  useEffect(() => {
    if (deleteItemCache) setIsModalConfirmShow(true)
  }, [deleteItemCache]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (props.addLevel1Count !== 0) addChild()
  }, [props.addLevel1Count]) // eslint-disable-line react-hooks/exhaustive-deps

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
                goToSection={(index: number) =>
                  props.goToSection ? props.goToSection(index) : null
                }
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
        There are {deleteItemCache?.level === 1 ? 'chapters' : 'secitons'} in
        the folders. Are you sure you want to delete all the content?
      </Modal>
    </>
  )
}
export default Menu

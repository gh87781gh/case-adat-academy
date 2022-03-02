import { useCallback, useState, useEffect } from 'react'
import update from 'immutability-helper'

import PathItem from './PathItem'

import { Btn } from 'utility/component'
import { Modal } from 'antd'

interface IProps {
  type: string
  path: any
  setPath: (path: any) => void
  courseMenu: any
  selectedCourseMenu: any
  addLevel1Count: number
}

const Path = (props: IProps) => {
  const [draggingItem, setDraggingItem] = useState<any>(null)
  const [dropTargetItem, setDropTargetItem] = useState<any>(null)
  const [deleteItemCache, setDeleteItemCache] = useState<any>(null)
  const [isModalConfirmShow, setIsModalConfirmShow] = useState<boolean>(false)

  // drag & drop
  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      // console.warn('moveCard:', dragIndex, hoverIndex)
      setDropTargetItem(props.path[hoverIndex])
      const dragCard = props.path[dragIndex]
      props.setPath(
        update(props.path, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard]
          ]
        })
      )
    },
    [props.path] // eslint-disable-line react-hooks/exhaustive-deps
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
      for (const item of props.path) {
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
      //  insert children of drag item and drop item into new path
      const insertDragChildrenIndex: number = ary.findIndex(
        (item: any) => item.key === dragKey
      )
      ary.splice(insertDragChildrenIndex + 1, 0, ...dragChildren)
      const insertDropChildrenIndex: number = ary.findIndex(
        (item: any) => item.key === dropKey
      )
      ary.splice(insertDropChildrenIndex + 1, 0, ...dropChildren)
    } else {
      ary = [...props.path]
    }

    props.setPath(resortKeys(ary))
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

  // expand and rename
  const expandChildren = (item: any) => {
    const ary = [...props.path]
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
    props.setPath(ary)
  }
  const rename = (index: number, value: string) => {
    const newMenu = [...props.path]
    newMenu[index].name = value
    props.setPath(newMenu)
  }

  // add item level 1
  const addChildLevel1 = () => {
    const ary = [...props.path]
    const item1s = props.path.filter((item: any) => {
      return item.level === 1
    })
    const item1 = {
      level: 1,
      key: `${item1s.length + 1}`,
      name: `Stage ${item1s.length + 1}`,
      index: props.path.length,
      courses: []
    }
    ary.push(item1)
    props.setPath(ary)
  }
  useEffect(() => {
    if (props.addLevel1Count !== 0) addChildLevel1()
  }, [props.addLevel1Count]) // eslint-disable-line react-hooks/exhaustive-deps

  // add item level 2
  const addChildLevel2 = (clickItem: any, course: any) => {
    console.log(clickItem, course, clickItem.key)
    // path 新增 course 進去
    const ary = [...props.path]
    let childrenCount: number = 0
    for (const item of ary) {
      if (item.level === 2 && item.key.split('-')[0] === clickItem.key)
        childrenCount++
    }
    console.log('childrenCount:', childrenCount)
    // props.setPath([])
    const itemLevel2 = {
      level: 2,
      key: `${clickItem.key}-${childrenCount + 1}`,
      name: course.name,
      id: course.id,
      enable: course.enable
    }
    // for (const stage of ary) {
    //   if (stage.id === clickItem.id) {
    //     stage.courses.push(itemLevel2)
    //   }
    // }
    ary.splice(clickItem.index + childrenCount + 1, 0, itemLevel2)

    // // 重新整理全部的 index
    ary.forEach((item: any, index: number) => {
      item.index = index
    })
    props.setPath(ary)
  }

  // delete item level 1&2
  const deleteItem = (item: any) => {
    const level: number = item.level

    // create new path without deleted item
    const ary: any = props.path.filter((el: any) => {
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
    props.setPath(resortKeys(ary))
    setIsModalConfirmShow(false)
  }
  useEffect(() => {
    if (deleteItemCache) setIsModalConfirmShow(true)
  }, [deleteItemCache]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className='ad-course-menu'>
        {props.path.map((item: any, index: number) => {
          return (
            <div key={item.key}>
              <PathItem
                type={props.type}
                path={props.path}
                courseMenu={props.courseMenu}
                selectedCourseMenu={props.selectedCourseMenu}
                item={{ ...item, index }}
                moveCard={(dragIndex: number, hoverIndex: number) =>
                  moveCard(dragIndex, hoverIndex)
                }
                addChildLevel2={(clickItem: any, course: any) =>
                  addChildLevel2(clickItem, course)
                }
                startDragging={(item: any) => startDragging(item)}
                isInDragging={draggingItem !== null}
                endDragging={() => endDragging()}
                expandChildren={(item: any) => expandChildren(item)}
                rename={(index: number, value: string) => rename(index, value)}
                handleDeleteItem={(item: any) => setDeleteItemCache(item)}
              />
            </div>
          )
        })}
      </div>
      <Modal
        zIndex={1001}
        title='Are you sure?'
        visible={isModalConfirmShow}
        onCancel={() => setIsModalConfirmShow(false)}
        footer={[
          <Btn
            key='Create'
            feature='action'
            onClick={() => deleteItem(deleteItemCache)}
          >
            Yes. Delete it.
          </Btn>,
          <Btn
            key='Cancel'
            feature='primary'
            onClick={() => setIsModalConfirmShow(false)}
          >
            No
          </Btn>
        ]}
        width={720}
      >
        Are you sure you want to delete all the content? If you delete chapter
        or group, the including sections will be deleted as well.
      </Modal>
    </>
  )
}
export default Path

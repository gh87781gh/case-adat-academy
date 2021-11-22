import { useCallback, useState, useRef, useEffect } from 'react'
import MenuItem from './MenuItem'
import update from 'immutability-helper'
import { Row, Col, Button, Input, Select, Modal } from 'antd'
import { idText } from 'typescript'

interface IProps {
  menu: any
  setMenu: (menu: any) => void
  addChild: (clickItem: any) => void
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

    // if level is 'section', there is no children need to be handle
    // if translate is not working, no need to handle children
    if (
      draggingItem.level === 'section' ||
      draggingItem === null ||
      dropTargetItem === null
    ) {
      setDraggingItem(null)
      return
    }

    // after translate items succeed, filter children of drag item and drop item
    const ary: any = []
    const dragChildren: any = []
    const dropChildren: any = []
    const dragId: string = draggingItem.id
    const dropId: string = dropTargetItem.id

    for (const item of props.menu) {
      const parentId: string =
        draggingItem.level === 'group'
          ? item.id.split('-')[0]
          : `${item.id.split('-')[0]}-${item.id.split('-')[1]}`
      if (item.level === draggingItem.level) {
        ary.push(item)
      } else {
        if (parentId === dragId) {
          dragChildren.push(item)
        } else if (parentId === dropId) {
          dropChildren.push(item)
        } else {
          ary.push(item)
        }
      }
    }

    //  insert children of drag item and drop item into new menu
    const insertDragChildrenIndex: number = ary.findIndex(
      (item: any) => item.id === dragId
    )
    ary.splice(insertDragChildrenIndex + 1, 0, ...dragChildren)
    const insertDropChildrenIndex: number = ary.findIndex(
      (item: any) => item.id === dropId
    )
    ary.splice(insertDropChildrenIndex + 1, 0, ...dropChildren)

    props.setMenu(ary)
    setDraggingItem(null)
  }
  const expandChildren = (item: any) => {
    const ary = [...props.menu]
    ary[item.index].isShowChildren = !ary[item.index].isShowChildren
    for (const el of ary) {
      const parentId: string =
        item.level === 'group'
          ? el.id.split('-')[0]
          : `${el.id.split('-')[0]}-${el.id.split('-')[1]}`

      if (
        (item.level === 'group' && item.id === parentId) ||
        (item.level === 'chapter' && el.id !== parentId && parentId === item.id)
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
    console.log('handleDeleteItem:', item)
    switch (item.level) {
      case 'group':
      case 'chapter':
        const isHasChildren = props.menu.find((el: any) => {
          let checkPrefix: string =
            item.level === 'group'
              ? el.id.split('-')[0]
              : `${el.id.split('-')[0]}-${el.id.split('-')[1]}`
          return item.level === 'group'
            ? checkPrefix === item.id && el.level === 'chapter'
            : checkPrefix === item.id && el.level === 'section'
        })
        isHasChildren ? setDeleteItemCache(item) : deleteItem(item)
        break
      case 'section':
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
        level === 'group'
          ? el.id.split('-')[0]
          : level === 'chapter'
          ? `${el.id.split('-')[0]}-${el.id.split('-')[1]}`
          : el.id
      if (prefix !== item.id) return el
    })

    // handle parent item's expanding arrow
    if (level === 'chapter' || level === 'section') {
      const parentId: string =
        level === 'chapter'
          ? item.id.split('-')[0]
          : `${item.id.split('-')[0]}-${item.id.split('-')[1]}`
      const isHasChildren = ary.find((el: any) => {
        const prefix: string =
          level === 'chapter'
            ? el.id.split('-')[0]
            : `${el.id.split('-')[0]}-${el.id.split('-')[1]}`
        return el.level === level && prefix === parentId
      })
      if (!isHasChildren) {
        const parentIndex = ary.findIndex((el: any) => el.id === parentId)
        ary[parentIndex].isShowChildren = null
      }
    }

    setDeleteItemCache(null)
    props.setMenu(ary)
  }
  useEffect(() => {
    if (deleteItemCache) setIsModalConfirmShow(true)
  }, [deleteItemCache])

  return (
    <>
      <div className='ad-course-menu'>
        {props.menu.map((item: any, index: number) => {
          return (
            <div key={item.id}>
              <MenuItem
                item={{ ...item, index }}
                moveCard={(dragIndex: number, hoverIndex: number) =>
                  moveCard(dragIndex, hoverIndex)
                }
                addChild={(clickItem: any) => props.addChild(clickItem)}
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
        There are {deleteItemCache?.level === 'group' ? 'chapters' : 'secitons'}{' '}
        in the folders. Are you sure you want to delete all the content?
      </Modal>
    </>
  )
}
export default Menu

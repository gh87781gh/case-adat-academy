import { useCallback, useState } from 'react'
import MenuItem from './MenuItem'
import update from 'immutability-helper'

interface IProps {
  menu: any
  setMenu: (menu: any) => void
}

const Menu = (props: IProps) => {
  const [draggingItem, setDraggingItem] = useState<any>(null)
  const [dropTargetItem, setDropTargetItem] = useState<any>(null)

  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      // console.warn('moveCard:',dragIndex, hoverIndex)
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

    if (draggingItem === null || dropTargetItem === null) {
      setDraggingItem(null)
      return
    }

    const newMenu: any = []
    const dragChildren: any = []
    const dropChildren: any = []
    for (const item of props.menu) {
      const isDragChild = draggingItem.children.find(
        (id: string) => id === item.id
      )
      const isDropChild = dropTargetItem.children.find(
        (id: string) => id === item.id
      )
      isDragChild
        ? dragChildren.push(item)
        : isDropChild
        ? dropChildren.push(item)
        : newMenu.push(item)
    }
    const insertDragChildrenIndex = newMenu.findIndex(
      (item: any) => item.id === draggingItem.id
    )
    newMenu.splice(insertDragChildrenIndex + 1, 0, ...dragChildren)
    const insertDropChildrenIndex = newMenu.findIndex(
      (item: any) => item.id === dropTargetItem.id
    )
    newMenu.splice(insertDropChildrenIndex + 1, 0, ...dropChildren)

    props.setMenu(newMenu)
    setDraggingItem(null)
  }

  const expandChildren = (
    clickId: string,
    isShowChildren: boolean,
    children: string[]
  ) => {
    const newMenu = [...props.menu]
    for (const id of children) {
      for (const item of newMenu) {
        if (item.id === clickId) item.isShowChildren = isShowChildren
        if (item.id === id) item.isShow = isShowChildren
      }
    }

    props.setMenu(newMenu)
  }

  const addChild = (clickItem: any) => {
    console.log('click clickItem:', clickItem)
    const childId = `${props.menu.length + 1}`
    const child: any = {
      level: clickItem.level === 'group' ? 'chapter' : 'section',
      id: childId,
      text: `${clickItem.level === 'group' ? 'chapter' : 'section'} name`,
      parentId: clickItem.id,
      isShowChildren: true,
      isShow: true,
      children: []
    }
    const mewMenu = [...props.menu]
    let insertIndex: number = 0
    props.menu.forEach((item: any, index: number, ary: any) => {
      // parent 加上 child
      if (item.id === clickItem.id) {
        item.isShowChildren = true
        item.children.push(childId)
        if (item.parentId) {
          // 如果再上層還有父元素，該父元素也要加上 child
          for (const el of ary) {
            if (el.id === item.parentId) {
              el.children.push(childId)
              break
            }
          }
        }
      }

      // 找這一串家族的最後一個
      // TODO 到這
      if (clickItem.id === item.id) {
        item.children.push(childId)
        insertIndex = index
      } else if (item.parentId === clickItem.id) {
        insertIndex = index
      }
    })
    mewMenu.splice(insertIndex + 1, 0, childId)
    props.setMenu(mewMenu)
  }

  const rename = (index: number, value: string) => {
    console.log(index, value)
    const newMenu = [...props.menu]
    newMenu[index].text = value
    props.setMenu(newMenu)
  }

  return (
    <>
      <div className='ad-course-menu'>
        {props.menu.map((item: any, index: number) => (
          <div key={item.id}>
            <MenuItem
              item={{ ...item, index }}
              moveCard={(dragIndex: number, hoverIndex: number) =>
                moveCard(dragIndex, hoverIndex)
              }
              startDragging={(item: any) => startDragging(item)}
              isInDragging={draggingItem !== null}
              endDragging={() => endDragging()}
              expandChildren={(
                clickId: string,
                isShowChildren: boolean,
                children: string[]
              ) => expandChildren(clickId, isShowChildren, children)}
              addChild={(clickItem: any) => addChild(clickItem)}
              rename={(index: number, value: string) => rename(index, value)}
            />
          </div>
        ))}
      </div>
    </>
  )
}
export default Menu

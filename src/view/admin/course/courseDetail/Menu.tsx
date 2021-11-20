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
      console.log(dragIndex, hoverIndex)
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
    console.log('startDragging')
    setDraggingItem(item)
  }

  const endDragging = () => {
    console.log('endDragging')
    console.log('draggingItem:', draggingItem)
    console.log('dropTargetItem:', dropTargetItem)
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

  return (
    <>
      <div className='ad-course-menu'>
        {props.menu.map((item: any, index: number) => (
          <div
            key={item.id}
            style={{
              opacity:
                !draggingItem || item.level === draggingItem.level ? 1 : 0.1
            }}
          >
            <MenuItem
              item={{ ...item, index }}
              moveCard={(dragIndex: number, hoverIndex: number) =>
                moveCard(dragIndex, hoverIndex)
              }
              startDragging={(item: any) => startDragging(item)}
              endDragging={() => endDragging()}
              expandChildren={(
                clickId: string,
                isShowChildren: boolean,
                children: string[]
              ) => expandChildren(clickId, isShowChildren, children)}
            />
          </div>
        ))}
      </div>
    </>
  )
}
export default Menu

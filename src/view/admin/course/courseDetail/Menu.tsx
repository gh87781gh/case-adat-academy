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

  const addChild = (level: string, id: string) => {
    // console.log(level, id)
    const childId = `${props.menu.length + 1}`
    const item: any = {
      level: level === 'group' ? 'chapter' : 'section',
      id: childId,
      text: `${level === 'group' ? 'chapter' : 'section'} name`,
      parentId: id,
      isShowChildren: true,
      isShow: true,
      children: []
    }
    const mewMenu = [...props.menu]
    let insertIndex: number = 0
    props.menu.forEach((item: any, index: number) => {
      if (item.id === id) {
        item.children.push(childId)
        item.isShowChildren = true
        insertIndex = index
      } else if (item.parentId === id) {
        insertIndex = index
      }
    })
    mewMenu.splice(insertIndex + 1, 0, item)
    props.setMenu(mewMenu)
  }

  const rename = (index: number, e: any) => {
    console.log(index, e)
    const newMenu = [...props.menu]
    newMenu[index].text = e.target.value
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
              addChild={(level: string, id: string) => addChild(level, id)}
              rename={(index: number, e: any) => rename(index, e)}
            />
          </div>
        ))}
      </div>
    </>
  )
}
export default Menu

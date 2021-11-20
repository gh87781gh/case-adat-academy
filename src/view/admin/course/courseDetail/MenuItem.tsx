import { useRef, useState, useEffect } from 'react'
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd'
import { XYCoord } from 'dnd-core'
import { IconMenu, IconArrowUp, IconMore, IconPlus } from 'utility/icon'

interface IProps {
  item: any
  // id: any
  // level: string
  // text: string
  // index: number
  moveCard: (dragIndex: number, hoverIndex: number) => void
  startDragging: (item: any) => void
  endDragging: () => void
  expandChildren: (
    clickId: string,
    isShowChildren: boolean,
    children: string[]
  ) => void
}

const MenuItem1 = (props: IProps) => {
  const ref = useRef<HTMLDivElement>(null)

  const [{ handlerId }, drop] = useDrop({
    accept: 'card',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      }
    },
    canDrop(item: any) {
      return item.level === props.item.level
    },
    hover(item: any, monitor: DropTargetMonitor) {
      if (!monitor.canDrop()) {
        return
      }

      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = props.item.index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      props.moveCard(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    }
  })
  const [{ isDragging }, drag, preview] = useDrag({
    type: 'card',
    item: () => {
      props.startDragging(props.item)
      return {
        id: props.item.id,
        index: props.item.index,
        level: props.item.level
      }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging()
    }),
    end() {
      props.endDragging()
    }
  })
  drag(drop(ref))

  return (
    <div
      ref={preview}
      style={{
        display:
          props.item.level !== 'group' && !props.item.isShow ? 'none' : 'flex'
      }}
      className={
        isDragging
          ? `isDragging item item-${props.item.level}`
          : `item item-${props.item.level}`
      }
    >
      <div
        className='item-grab'
        ref={ref}
        style={{ opacity: isDragging ? 0 : 1 }}
        data-handler-id={handlerId}
      >
        <IconMenu />
      </div>
      <div
        className='item-btn-arrow'
        style={{
          visibility:
            props.item.isShowChildren === null ||
            props.item.children.length === 0
              ? 'hidden'
              : 'visible',
          transform:
            props.item.isShowChildren === true
              ? 'rotate(180deg)'
              : 'rotate(0deg)'
        }}
        onClick={() =>
          props.expandChildren(
            // props.item.level,
            props.item.id,
            !props.item.isShowChildren,
            props.item.children
          )
        }
      >
        <IconArrowUp />
      </div>
      <div className='item-text'>{props.item.text}</div>
      <div className='item-extra'>
        <IconPlus />
        <IconMore />
      </div>
    </div>
  )
}
export default MenuItem1

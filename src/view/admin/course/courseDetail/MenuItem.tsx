import { useRef, useState, useEffect } from 'react'
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd'
import { XYCoord } from 'dnd-core'
import { IconMenu, IconArrowUp, IconMore, IconPlus } from 'utility/icon'
import { Menu, Dropdown } from 'antd'

interface IProps {
  item: any
  moveCard: (dragIndex: number, hoverIndex: number) => void
  addChild?: (clickItem: any) => void
  startDragging: (item: any) => void
  isInDragging: boolean
  endDragging: () => void
  expandChildren: (item: any) => void
  rename: (index: number, value: string) => void
  handleDeleteItem: (item: any) => void
}

const MenuItem = (props: IProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  useEffect(() => {
    if (isEditing) inputRef.current?.focus()
  }, [isEditing])

  const [{ handlerId, isCanDrop }, drop] = useDrop({
    accept: 'card',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isCanDrop: monitor.canDrop()
      }
    },
    canDrop(item: any) {
      if (item.level === 'A') {
        return item.level === props.item.level
      } else {
        const level = item.level
        const id1 =
          level === 'B'
            ? item.key.split('-')[0]
            : level === 'C'
            ? `${item.key.split('-')[0]}-${item.key.split('-')[1]}`
            : ''
        const id2 =
          level === 'B'
            ? props.item.key.split('-')[0]
            : level === 'C'
            ? `${props.item.key.split('-')[0]}-${props.item.key.split('-')[1]}`
            : ''
        return item.level === props.item.level && id1 === id2
      }
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
      // console.log('dragIndex:', dragIndex, 'hoverIndex:', hoverIndex)

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
      return props.item
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging()
    }),
    end() {
      props.endDragging()
    }
  })
  drag(drop(ref))

  const renderMoreList = (
    <Menu>
      <Menu.Item key='rename'>
        <div onClick={() => setIsEditing(true)}>Rename</div>
      </Menu.Item>
      <Menu.Item key='delete'>
        <div onClick={() => props.handleDeleteItem(props.item)}>Delete</div>
      </Menu.Item>
    </Menu>
  )
  return (
    <>
      <div
        ref={preview}
        style={{
          display:
            props.item.level !== 'A' && !props.item.isShow ? 'none' : 'flex',
          opacity: !props.isInDragging ? 1 : isCanDrop ? 1 : 0.1
        }}
        className={`${isDragging ? 'isDragging' : ''} item item-${
          props.item.level
        }`}
      >
        <div className='item-grab' ref={ref} data-handler-id={handlerId}>
          <IconMenu />
        </div>
        <div
          className='item-btn-arrow'
          style={{
            visibility:
              props.item.isShowChildren === null ? 'hidden' : 'visible',
            transform: props.item.isShowChildren
              ? 'rotate(0deg)'
              : 'rotate(180deg)'
          }}
          onClick={() => props.expandChildren(props.item)}
        >
          <IconArrowUp />
        </div>
        <div className='item-text'>
          {isEditing ? (
            <input
              ref={inputRef}
              type='text'
              defaultValue={props.item.text}
              onBlur={(e) => {
                setIsEditing(false)
                props.rename(props.item.index, e.target.value)
              }}
            />
          ) : (
            <>{props.item.text}</>
          )}
        </div>
        <div className='item-extra'>
          <IconPlus
            style={{
              visibility: props.item.level === 'C' ? 'hidden' : 'visible'
            }}
            onClick={() => (props.addChild ? props.addChild(props.item) : null)}
          />
          <Dropdown overlay={renderMoreList} trigger={['click']}>
            <IconMore />
          </Dropdown>
        </div>
      </div>
    </>
  )
}
export default MenuItem

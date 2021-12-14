import { useRef, useState, useEffect } from 'react'
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd'
import { XYCoord } from 'dnd-core'
import {
  IconMenu,
  IconArrowUp,
  IconPlus,
  IconDelete,
  IconArrowRight,
  IconDanger
} from 'utility/icon'
import { Menu, Dropdown } from 'antd'

interface IProps {
  type: string
  menu: any
  courseMenu?: any
  selectedCourseMenu?: any
  item: any
  moveCard: (dragIndex: number, hoverIndex: number) => void
  addChild: (clickItem: any, course?: any) => void
  startDragging: (item: any) => void
  isInDragging: boolean
  endDragging: () => void
  expandChildren: (item: any) => void
  rename: (index: number, value: string) => void
  handleDeleteItem: (item: any) => void
  goToSection: (index: number) => void
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
      //  item : dragging item
      //  props.item : hover 當下位置的 item，有可能是 dragging item 本身
      switch (item.level) {
        case 2:
          return (
            (props.menu[props.item.index - 1]?.level === 2 ||
              props.menu[props.item.index - 1]?.level === 2) &&
            props.menu[props.item.index]?.level !== 1
          )
        case 2:
          return (
            props.menu[props.item.index - 1]?.level !== 2 &&
            props.item.index !== 0
          )
        default:
          // case A
          return item.level === props.item.level
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

  const renderCourseList = () => {
    return (
      <Menu>
        {props.courseMenu.map((course: any) => {
          const isSelected: boolean = props.selectedCourseMenu.find(
            (el: any) => el.id === course.id
          )
          return (
            <Menu.Item
              key={course.key}
              disabled={isSelected}
              onClick={() => props.addChild(props.item, course)}
            >
              <div>{course.name}</div>
            </Menu.Item>
          )
        })}
      </Menu>
    )
  }
  const renderText = () => (
    <>
      {isEditing ? (
        <input
          ref={inputRef}
          type='text'
          defaultValue={props.item.name}
          onBlur={(e) => {
            setIsEditing(false)
            props.rename(props.item.index, e.target.value)
          }}
        />
      ) : (
        <div
          onClick={() => {
            if (
              props.type === 'COURSE_MENU' ||
              (props.type === 'LEARNING_PATH' && props.item.level === 1)
            ) {
              setIsEditing(true)
            }
          }}
        >
          {props.item.name}{' '}
          {props.item.level === 2 && props.item.enable === false ? (
            <IconDanger className='ad-color-danger' />
          ) : null}
        </div>
      )}
    </>
  )

  return (
    <>
      <div
        ref={preview}
        style={{
          display:
            props.item.level !== 1 && !props.item.isShow ? 'none' : 'flex',
          opacity: !props.isInDragging ? 1 : 1
          // opacity: !props.isInDragging ? 1 : isCanDrop ? 1 : 0.1
        }}
        className={`${isDragging ? 'isDragging' : ''} item item-${
          props.item.level
        } ${
          props.type === 'LEARNING_PATH' && props.item.level === 2
            ? 'item-course'
            : ''
        }`}
      >
        <div className='item-grab' ref={ref} data-handler-id={handlerId}>
          <IconMenu />
        </div>
        {props.type === 'COURSE_MENU' ? (
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
        ) : null}
        <div className='item-text'>{renderText()}</div>
        <div className='item-extra'>
          {props.type === 'COURSE_MENU' && props.item.level !== 3 ? (
            <IconPlus
              onClick={() =>
                props.addChild ? props.addChild(props.item) : null
              }
            />
          ) : null}
          {props.type === 'LEARNING_PATH' && props.item.level === 1 ? (
            <Dropdown
              overlay={renderCourseList}
              trigger={['click']}
              placement='bottomRight'
            >
              <IconPlus />
            </Dropdown>
          ) : null}
          <IconDelete onClick={() => props.handleDeleteItem(props.item)} />
          {props.item.level === 3 ? (
            <IconArrowRight
              onClick={() => props.goToSection(props.item.index)}
            />
          ) : null}
        </div>
      </div>
    </>
  )
}
export default MenuItem

import { useRef, useState, useEffect } from 'react'
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd'
import { XYCoord } from 'dnd-core'
import { IconMenu, IconArrowUp, IconMore, IconPlus } from 'utility/icon'
import { Row, Col, Button, Input, Select, Modal } from 'antd'

interface IProps {
  item: any
  moveCard: (dragIndex: number, hoverIndex: number) => void
  startDragging: (item: any) => void
  isInDragging: boolean
  endDragging: () => void
  expandChildren: (
    clickId: string,
    isShowChildren: boolean,
    children: string[]
  ) => void
  addChild: (clickItem: any) => void
  rename: (index: number, value: string) => void
}

const MenuItem1 = (props: IProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isShowDropdown, setIsShowDropdown] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isModalConfirmShow, setIsModalConfirmShow] = useState<boolean>(false)
  useEffect(() => {
    if (isEditing) inputRef.current?.focus()
  }, [isEditing]) // eslint-disable-line react-hooks/exhaustive-deps
  const renderConfirmModal = () => (
    <Modal
      title='Are you sure?'
      visible={isModalConfirmShow}
      onCancel={() => setIsModalConfirmShow(false)}
      footer={[
        <Button
          key='Create'
          type='primary'
          // onClick={() => deletePurchase()}
        >
          Yes. Delete it.
        </Button>,
        <Button key='Cancel' onClick={() => setIsModalConfirmShow(false)}>
          No
        </Button>
      ]}
      width={720}
    >
      There are sections in the folders. Are you sure you want to delete all the
      content?
    </Modal>
  )

  const [{ handlerId, isCanDrop }, drop] = useDrop({
    accept: 'card',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isCanDrop: monitor.canDrop()
      }
    },
    canDrop(item: any) {
      if (item.level === 'group') {
        return item.level === props.item.level
      } else {
        return item.parentId === props.item.parentId
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
        level: props.item.level,
        parentId: props.item.parentId
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
    <>
      <div
        ref={preview}
        style={{
          display:
            props.item.level !== 'group' && !props.item.isShow
              ? 'none'
              : 'flex',
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
              props.item.isShowChildren === null ||
              props.item.children.length === 0
                ? 'hidden'
                : 'visible',
            transform: props.item.isShowChildren
              ? 'rotate(0deg)'
              : 'rotate(180deg)'
          }}
          onClick={() =>
            props.expandChildren(
              props.item.id,
              !props.item.isShowChildren,
              props.item.children
            )
          }
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
              visibility: props.item.level === 'section' ? 'hidden' : 'visible'
            }}
            onClick={() => props.addChild(props.item)}
          />
          <IconMore onClick={() => setIsShowDropdown(!isShowDropdown)} />
          <div
            className='item-extra-dropdown'
            style={{ display: isShowDropdown ? 'block' : 'none' }}
          >
            <div
              onClick={() => {
                setIsEditing(true)
                setIsShowDropdown(false)
              }}
            >
              Rename
            </div>
            <div>Delete</div>
          </div>
        </div>
      </div>
      {renderConfirmModal()}
    </>
  )
}
export default MenuItem1

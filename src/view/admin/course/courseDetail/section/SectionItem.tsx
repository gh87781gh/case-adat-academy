import { useRef, useState } from 'react'
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd'
import { XYCoord } from 'dnd-core'

import { IconMenu, IconMore } from 'utility/icon'
import { UploadVideo, UploadImg } from 'utility/component'
import { Menu, Dropdown, Input } from 'antd'
const { TextArea } = Input

interface IProps {
  menu: any
  item: any
  moveCard: (dragIndex: number, hoverIndex: number) => void
  startDragging: (item: any) => void
  isInDragging: boolean
  endDragging: () => void
  updateSection: (index: number, type: string, value: string) => void
  courseId: string
  deleteItem: (index: number) => void
}

const SectionItem = (props: IProps) => {
  const ref = useRef<HTMLDivElement>(null)

  // drag and drop
  const [replaceCount, setReplaceCount] = useState<number>(0)
  const [{ handlerId }, drop] = useDrop({
    accept: 'card',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
        // isCanDrop: monitor.canDrop()
      }
    },
    canDrop(item: any) {
      //  item : dragging item
      //  props.item : hover 當下位置的 item，有可能是 dragging item 本身
      return true
      // switch (item.level) {
      //   case 2:
      //     return (
      //       (props.menu[props.item.index - 1]?.level === 2 ||
      //         props.menu[props.item.index - 1]?.level === 2) &&
      //       props.menu[props.item.index]?.level !== 1
      //     )
      //   case 2:
      //     return (
      //       props.menu[props.item.index - 1]?.level !== 2 &&
      //       props.item.index !== 0
      //     )
      //   default:
      //     // case A
      //     return item.level === props.item.level
      // }
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
  const onChange = (type: string, e: any) => {
    props.updateSection(props.item.index, type, e.target.value)
  }
  const onUpload = (type: string, value: string) => {
    props.updateSection(props.item.index, type, value)
  }

  // render
  const renderContentDetail = () => {
    return props.item.type === 'title' ? (
      <TextArea
        className='item-content-textarea title'
        autoSize={true}
        value={props.item.content}
        onChange={(e) => onChange(props.item.type, e)}
      />
    ) : props.item.type === 'paragraph' ? (
      <TextArea
        style={{ minHeight: '100px' }}
        className='item-content-textarea paragraph'
        autoSize={true}
        value={props.item.content}
        onChange={(e) => onChange(props.item.type, e)}
      />
    ) : props.item.type === 'picture' ? (
      <UploadImg
        theme='dark'
        type='rectangle'
        desc='Upload picture'
        system='course'
        systemId={props.courseId}
        imgId={props.item.archive_id}
        setUploadId={(id: string) => onUpload(props.item.type, id)}
        replaceCount={replaceCount}
      />
    ) : props.item.type === 'video' ? (
      <UploadVideo
        type='video'
        desc='Upload video'
        system='course'
        systemId={props.courseId}
        archiveId={props.item.archive_id}
        setUploadId={(id: string) => onUpload(props.item.type, id)}
      />
    ) : null
  }
  return (
    <>
      <div ref={preview} className={`${isDragging ? 'isDragging' : ''} item`}>
        <div className='item-grab' ref={ref} data-handler-id={handlerId}>
          <IconMenu className='item-icon-grab' />
          <span className='item-content-type'>{props.item.type}</span>
          <Dropdown
            overlay={
              <Menu>
                {props.item.type === 'picture' ||
                props.item.type === 'video' ? (
                  <Menu.Item
                    key={0}
                    onClick={() => setReplaceCount(replaceCount + 1)}
                  >
                    Replace
                  </Menu.Item>
                ) : null}
                <Menu.Item
                  key={1}
                  onClick={() => props.deleteItem(props.item.index)}
                >
                  Delete
                </Menu.Item>
              </Menu>
            }
            trigger={['click']}
            placement='bottomRight'
          >
            <IconMore className='item-icon-more' />
          </Dropdown>
        </div>
        <div className={`item-content item-content-${props.item.type}`}>
          {renderContentDetail()}
        </div>
      </div>
    </>
  )
}
export default SectionItem

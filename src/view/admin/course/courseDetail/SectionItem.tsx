import { useRef, useState, useEffect } from 'react'
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd'
import { XYCoord } from 'dnd-core'
import { StaticService } from 'storage'
import {
  IconMenu,
  IconArrowUp,
  IconMore,
  IconDelete,
  IconArrowRight,
  IconDanger
} from 'utility/icon'
import UploadImg from 'utility/component/UploadImg'
import UploadVideo from 'utility/component/UploadVideo'
import { Menu, Dropdown, Input } from 'antd'
const { TextArea } = Input

interface IProps {
  menu: any
  item: any
  moveCard: (dragIndex: number, hoverIndex: number) => void
  addChild: (clickItem: any, course?: any) => void
  startDragging: (item: any) => void
  isInDragging: boolean
  endDragging: () => void
  expandChildren: (item: any) => void
  updateSection: (index: number, type: string, value: string) => void
  courseId: string
  handleDeleteItem: (item: any) => void
}

const SectionItem = (props: IProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [replaceCount, setReplaceCount] = useState<number>(0)

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

  const renderMoreList = () => {
    return (
      <Menu>
        <Menu.Item key={0} onClick={() => setReplaceCount(replaceCount + 1)}>
          Replace
        </Menu.Item>
        <Menu.Item key={1}>Delete</Menu.Item>
      </Menu>
    )
  }

  const onChange = (type: string, e: any) => {
    const value = e.target.value
    // if (value) {
    //   switch (key) {
    //     case 'email':
    //       if (value && !ValidateStr('isUserName', value)) return false
    //       break
    //   }
    // }
    props.updateSection(props.item.index, type, value)
    // setData({ ...data, [key]: value })
  }
  const onUpload = (type: string, value: string) => {
    props.updateSection(props.item.index, type, value)
  }

  const { chapterContentType } = StaticService
  return (
    <>
      <div
        ref={preview}
        // style={{
        //   display:
        //     props.item.level !== 1 && !props.item.isShow ? 'none' : 'flex',
        //   opacity: !props.isInDragging ? 1 : 1
        //   // opacity: !props.isInDragging ? 1 : isCanDrop ? 1 : 0.1
        // }}
        className={`${isDragging ? 'isDragging' : ''} item`}
      >
        <div className='item-grab' ref={ref} data-handler-id={handlerId}>
          <IconMenu className='item-icon-grab' />
          {props.item.type === 'picture' || props.item.type === 'video' ? (
            <Dropdown
              overlay={renderMoreList}
              trigger={['click']}
              placement='bottomRight'
            >
              <IconMore className='item-icon-more' />
            </Dropdown>
          ) : null}
        </div>
        <div className={`item-content item-content-${props.item.type}`}>
          {props.item.type === chapterContentType.title ? (
            <TextArea
              className='item-content-textarea title'
              rows={2}
              value={props.item.content}
              onChange={(e) => onChange(props.item.type, e)}
            />
          ) : props.item.type === chapterContentType.paragraph ? (
            <TextArea
              className='item-content-textarea paragraph'
              rows={6}
              value={props.item.content}
              onChange={(e) => onChange(props.item.type, e)}
            />
          ) : props.item.type === chapterContentType.picture ? (
            <UploadImg
              type='rectangle'
              desc='Upload picture'
              system='course'
              systemId={props.courseId}
              imgId={props.item.archive_id}
              setUploadId={(id: string) => onUpload(props.item.type, id)}
              replaceCount={replaceCount}
            />
          ) : props.item.type === chapterContentType.video ? (
            <UploadVideo
              type='video'
              desc='Upload video'
              system='course'
              systemId={props.courseId}
              imgId={props.item.archive_id}
              setUploadId={(id: string) => onUpload(props.item.type, id)}
            />
          ) : null}
        </div>
        {/* {props.type === 'COURSE_MENU' ? (
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
        ) : null} */}
        {/* <div className='item-extra'>
          {props.type === 'COURSE_MENU' && props.item.level !== 3 ? (
            <IconMore
              onClick={() =>
                props.addChild ? props.addChild(props.item) : null
              }
            />
          ) : null}
          {props.type === 'LEARNING_PATH' && props.item.level === 1 ? (
            <Dropdown
              overlay={renderMoreList}
              trigger={['click']}
              placement='bottomRight'
            >
              <IconMore />
            </Dropdown>
          ) : null}
          <IconDelete onClick={() => props.handleDeleteItem(props.item)} />
        </div> */}
      </div>
    </>
  )
}
export default SectionItem

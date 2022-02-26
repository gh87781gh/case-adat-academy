import { useCallback, useState, useEffect, useContext } from 'react'
import { MyContext } from 'storage'
import { useParams } from 'react-router-dom'
import CourseApi from 'api/admin/CourseApi'
import update from 'immutability-helper'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import SectionItem from './SectionItem'

import { Btn, UploadVideo } from 'utility/component'
import { message, Dropdown, Menu } from 'antd'

const contentInitItem: any = {
  video: {
    type: 'video',
    content: '',
    archive_id: ''
  },
  title: {
    type: 'title',
    content: '',
    archive_id: ''
  },
  paragraph: {
    type: 'paragraph',
    content: '',
    archive_id: ''
  },
  picture: {
    type: 'picture',
    content: '',
    archive_id: ''
  }
}

const Section = () => {
  const context = useContext(MyContext)
  const api = new CourseApi()
  const { courseId, sectionId } =
    useParams<{ courseId: string; sectionId?: string }>()

  // data
  const [currentSectionDetail, setCurrentSectionDetail] = useState<any>({})
  const [currentSectionContent, setCurrentSectionContent] = useState<any>([])
  const getCurrentSectionContent = () => {
    setCurrentSectionContent([])
    context.setIsLoading(true)
    if (courseId && sectionId) {
      api
        .getCurrentSectionContent(courseId, sectionId)
        .then((res: any) => {
          if (res.data.length === 0) {
            const initContent = [
              { ...contentInitItem.video, key: 0 },
              { ...contentInitItem.title, key: 1 },
              { ...contentInitItem.paragraph, key: 2 }
            ]
            res.data = initContent
          }
          setCurrentSectionDetail({ name: res.section_name })
          setCurrentSectionContent(res.data)
        })
        .finally(() => context.setIsLoading(false))
    }
  }
  const updateCurrentSectionContent = (
    index: number,
    type: string,
    value: string
  ) => {
    const newContent: any = [...currentSectionContent]
    if (type === 'video' || type === 'picture') {
      newContent[index].archive_id = value
    } else {
      newContent[index].content = value
    }
    setCurrentSectionContent(newContent)
  }
  useEffect(() => {
    if (sectionId) {
      getCurrentSectionContent()
    }
  }, [sectionId]) // eslint-disable-line react-hooks/exhaustive-deps

  // drag and drop
  const [draggingItem, setDraggingItem] = useState<any>(null)
  const [dropTargetItem, setDropTargetItem] = useState<any>(null)
  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      // console.warn('moveCard:', dragIndex, hoverIndex)
      setDropTargetItem(currentSectionContent[hoverIndex])
      const dragCard = currentSectionContent[dragIndex]
      setCurrentSectionContent(
        update(currentSectionContent, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard]
          ]
        })
      )
    },
    [currentSectionContent] // eslint-disable-line react-hooks/exhaustive-deps
  )
  const startDragging = (item: any) => {
    // console.warn('startDragging')
    setDraggingItem(item)
  }
  const endDragging = () => {
    // console.warn('endDragging')
    // console.warn('draggingItem:', draggingItem)
    // console.warn('dropTargetItem:', dropTargetItem)

    // if level is 3, there is no children need to be handle
    // if translate is not working, no need to handle children
    if (draggingItem === null || dropTargetItem === null) {
      setDraggingItem(null)
      return
    }

    let ary: any = []

    // 調整 drag/drop 的 children
    if (draggingItem.level === 1 || draggingItem.level === 2) {
      // after translate items succeed, filter children of drag item and drop item
      const dragChildren: any = []
      const dropChildren: any = []
      const dragKey: string = draggingItem.key
      const dropKey: string = dropTargetItem.key
      for (const item of currentSectionContent) {
        const parentId: string =
          draggingItem.level === 1
            ? item.key.split('-')[0]
            : `${item.key.split('-')[0]}-${item.key.split('-')[1]}`
        if (item.level === draggingItem.level) {
          ary.push(item)
        } else {
          if (parentId === dragKey) {
            dragChildren.push(item)
          } else if (parentId === dropKey) {
            dropChildren.push(item)
          } else {
            ary.push(item)
          }
        }
      }
      //  insert children of drag item and drop item into new menu
      const insertDragChildrenIndex: number = ary.findIndex(
        (item: any) => item.key === dragKey
      )
      ary.splice(insertDragChildrenIndex + 1, 0, ...dragChildren)
      const insertDropChildrenIndex: number = ary.findIndex(
        (item: any) => item.key === dropKey
      )
      ary.splice(insertDropChildrenIndex + 1, 0, ...dropChildren)
    } else {
      ary = [...currentSectionContent]
    }

    setCurrentSectionContent(resortKeys(ary))
    setDraggingItem(null)
  }
  const resortKeys = (array: any) => {
    let indexA: number = 0
    let indexB: number = 0
    let indexC: number = 0
    array.forEach((item: any, index: number) => {
      switch (item.level) {
        case 1:
          if (indexA !== 0) {
            indexB = 0
            indexC = 0
          }
          indexA++
          item.key = `${indexA}`
          break
        case 2:
          indexB++
          item.key = `${indexA}-${indexB}`
          break
        case 3:
          indexC++
          item.key = `${indexA}-${indexB}-${indexC}`
          break
      }
    })
    return array
  }
  const deleteItem = (index: number) => {
    const ary = [...currentSectionContent]
    ary.splice(index, 1)
    setCurrentSectionContent(ary)
  }
  const addChild = (type: string) => {
    const ary: any = [...currentSectionContent]
    ary.push({ ...contentInitItem[type], key: currentSectionContent.length })
    setCurrentSectionContent(ary)
  }

  // api
  const save = () => {
    if (courseId && sectionId) {
      api
        .saveCurrentSectionContent(courseId, sectionId, currentSectionContent)
        .then(() => {
          message.success('Saved')
          getCurrentSectionContent()
        })
        .finally(() => context.setIsLoading(false))
    }
  }

  // render
  const renderSectionItem = () => {
    return (
      <div className='ad-course-sections'>
        {currentSectionContent.map((item: any, index: number) => {
          // the first video is fixed on the top, other contents render here and can be dragged and dropped.
          if (item.key !== 0) {
            return (
              <div key={item.key}>
                <SectionItem
                  menu={currentSectionContent}
                  item={{ ...item, index }}
                  moveCard={(dragIndex: number, hoverIndex: number) =>
                    moveCard(dragIndex, hoverIndex)
                  }
                  // addChild={(clickItem: any, course?: any) =>
                  //   addChild(clickItem, course)
                  // }
                  startDragging={(item: any) => startDragging(item)}
                  isInDragging={draggingItem !== null}
                  endDragging={() => endDragging()}
                  updateSection={(index: number, type: string, value: string) =>
                    updateCurrentSectionContent(index, type, value)
                  }
                  courseId={courseId}
                  deleteItem={(index: number) => deleteItem(index)}
                />
              </div>
            )
          } else {
            return null
          }
        })}
      </div>
    )
  }
  return (
    <>
      <h2>{currentSectionDetail.name}</h2>
      <div className='ad-layout-admin-article-content'>
        {currentSectionContent ? (
          <>
            {/* the first video is fixed on the top */}
            <UploadVideo
              type='video'
              desc='Upload section video'
              system='course'
              systemId={courseId}
              archiveId={currentSectionContent[0]?.archive_id}
              setUploadId={(id: string) => {
                updateCurrentSectionContent(0, 'video', id)
              }}
            />
            <p className='ad-upload-info'>
              Format should be .mp4 The file size limit is 300mb.
              <br /> This section video is required, and will be fixed on the
              top
            </p>
            <DndProvider backend={HTML5Backend}>
              {renderSectionItem()}
            </DndProvider>
            <div className='ad-course-menu-addGroup'>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key={0} onClick={() => addChild('video')}>
                      video
                    </Menu.Item>
                    <Menu.Item key={0} onClick={() => addChild('title')}>
                      title
                    </Menu.Item>
                    <Menu.Item key={0} onClick={() => addChild('paragraph')}>
                      paragraph
                    </Menu.Item>
                    <Menu.Item key={0} onClick={() => addChild('picture')}>
                      picture
                    </Menu.Item>
                  </Menu>
                }
                trigger={['click']}
                placement='bottomLeft'
              >
                <span>
                  <em></em>
                  <em></em>
                </span>
              </Dropdown>
            </div>
            <div className='ad-layout-admin-article-row-section-footer'>
              <div className='ad-btn-group'>
                <Btn feature='action' onClick={() => save()}>
                  Save
                </Btn>
                <Btn
                  feature='primary'
                  onClick={() => getCurrentSectionContent()}
                >
                  Reset
                </Btn>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </>
  )
}
export default Section

import { useState, useEffect, useContext } from 'react'
import { MyContext } from 'storage'
import { useParams } from 'react-router-dom'
import CourseApi from 'api/admin/CourseApi'
import { Btn, UploadVideo } from 'utility/component'
import { Row, Col, Breadcrumb, message } from 'antd'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import CourseDetailMenu from './Menu'
import Sections from './Sections'
import { Dropdown, Menu } from 'antd'

interface IProps {
  prev: () => void
}

const CourseDetail = (props: IProps) => {
  const context = useContext(MyContext)
  const api = new CourseApi()
  const { courseId, sectionId } =
    useParams<{ courseId: string; sectionId?: string }>()

  // TODO course detail setting
  const [courseName, setCourseName] = useState<string>('')
  const [courseStatus, setCourseStatus] = useState<string>('')

  // TODO course menu
  const [menu, setMenu] = useState<any>([
    // {
    //   level: 1,
    //   key: '1',
    //   name: 'group name',
    //   isShowChildren: true,
    //   isShow: true
    // },
    // {
    //   level: 2,
    //   key: '1-1',
    //   name: 'chapter name',
    //   isShowChildren: true,
    //   isShow: true
    // },
    // {
    //   level: 3,
    //   key: '1-1-1',
    //   name: 'section name',
    //   isShowChildren: null,
    //   isShow: true,
    //   sections: [
    //     {
    //       // type: 'title | picture | video | paragraph',
    //       key: '1',
    //       type: 'video',
    //       content: '',
    //       archive_id: ''
    //     },
    //     {
    //       // type: 'title | picture | video | paragraph',
    //       key: '2',
    //       type: 'title',
    //       content: 'blablabla2',
    //       archive_id: ''
    //     }
    //   ]
    // }
  ])
  let [addLevel1Count, setAddLevelACount] = useState<number>(0)

  // current section
  const [currentSection, setCurrentSection] = useState<any>({})
  const getCurrentSection = (courseId: string, sectionId: string) => {
    context.setIsLoading(true)
    api
      .getCurrentSection(courseId, sectionId)
      .then((res: any) => setCurrentSection(res.data))
      .finally(() => context.setIsLoading(false))
  }

  const [sections, setSections] = useState<any>([])
  const [sectionIndex, setSectionIndex] = useState<null | number>(null)
  const [sectionName, setSectionName] = useState<string>('')
  const goToSection = (menu: any, index: number) => {
    if (!menu[index]) return false

    const ary: any = [...menu]
    if (ary[index].sections.length === 0) {
      // first item must be video
      ary[index].sections.push({
        type: 'video',
        content: '',
        archive_id: '',
        key: '0'
      })
    }

    setMenu(ary)
    setSectionIndex(index)
    setSections(ary[index].sections)
    setSectionName(ary[index].name)
  }
  const updateSection = (index: number, type: string, value: string) => {
    const newMenu: any = [...menu]
    const newSections: any = [...sections]
    if (type === 'video' || type === 'picture') {
      newSections[index].archive_id = value
    } else {
      newSections[index].content = value
    }
    if (sectionIndex !== null) {
      newMenu[sectionIndex].sections = newSections
    }
    setMenu(newMenu)
    setSections(newSections)
  }
  const addSection = (type: string) => {
    const newMenu: any = [...menu]
    const newSections: any = [...sections]

    newSections.push({
      type,
      content: '',
      archive_id: '',
      key: `${sections.length}`
    })
    if (sectionIndex !== null) newMenu[sectionIndex].sections = newSections

    setMenu(newMenu)
    setSections(newSections)
  }

  const getInitData = async () => {
    context.setIsLoading(true)
    await api.getCourseDetail(courseId).then((res: any) => {
      setCourseName(res.data.name)
      setCourseStatus(res.data.status)
    })
    await api
      .getCourseChapter(courseId)
      .then((res: any) => {
        setMenu(res)
        const firstSectionsIndex = res.findIndex((el: any) => el.level === 3)
        if (firstSectionsIndex) goToSection(res, firstSectionsIndex)
      })
      .finally(() => context.setIsLoading(false))
  }
  const editCourseChapter = () => {
    context.setIsLoading(true)
    api
      .editCourseChapter(courseId, menu)
      .then(() => {
        message.success('Course saved successfully')
      })
      .finally(() => context.setIsLoading(false))
  }
  useEffect(() => {
    getInitData()
    // .catch(() => props.prev())
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // render
  const renderMenu = () => {
    return (
      <>
        <DndProvider backend={HTML5Backend}>
          <CourseDetailMenu
            type='COURSE_MENU'
            menu={menu}
            setMenu={(menu: any) => setMenu(menu)}
            addLevel1Count={addLevel1Count}
            goToSection={(index: number) => goToSection(menu, index)}
          />
        </DndProvider>
        <div
          className='ad-course-menu-addGroup'
          onClick={() => setAddLevelACount(addLevel1Count + 1)}
        >
          <span>
            <em></em>
            <em></em>
          </span>
        </div>
      </>
    )
  }
  const renderCurrentSection = () => {
    return (
      <>
        <h2>{sectionName}</h2>
        {/* <UploadVideo
          type='video'
          desc='Upload section video'
          system='course'
          systemId={courseDetail.id}
          imgId={sections[0]?.archive_id}
          setUploadId={(id: string) => updateSection(0, 'video', id)}
        /> */}
        {/* <p className='ad-upload-info'>
          Format should be .mp4 The file size limit is 300mb.
          <br /> This section video is required, and will be fixed on the top
        </p> */}
        <DndProvider backend={HTML5Backend}>
          {/* <Sections
            sections={sections}
            setMenu={(menu: any) => setSections(menu)}
            updateSection={(index: number, type: string, value: string) =>
              updateSection(index, type, value)
            }
            courseId={courseDetail.id}
          /> */}
        </DndProvider>
      </>
    )
  }
  const renderCurrentSectionTypeDropdown = () => {
    const menu = (
      <Menu className='ad-course-content-addContent'>
        <Menu.Item key={0} onClick={() => addSection('title')}>
          Paragraph title
        </Menu.Item>
        <Menu.Item key={1} onClick={() => addSection('paragraph')}>
          Paragraph body
        </Menu.Item>
        <Menu.Item key={2} onClick={() => addSection('picture')}>
          Photo
        </Menu.Item>
        <Menu.Item key={3} onClick={() => addSection('video')}>
          Video
        </Menu.Item>
      </Menu>
    )
    return (
      <Dropdown overlay={menu} trigger={['click']} placement='bottomCenter'>
        <div className='ad-course-menu-addGroup'>
          <span>
            <em></em>
            <em></em>
          </span>
        </div>
      </Dropdown>
    )
  }
  return (
    <div className='ad-layout-admin-courseDetail'>
      <Breadcrumb separator='>'>
        <Breadcrumb.Item onClick={props.prev}>
          Course management
        </Breadcrumb.Item>
        <Breadcrumb.Item>{courseName}</Breadcrumb.Item>
      </Breadcrumb>
      <h1 className='ad-layout-admin-article-title'>
        {courseName}
        <span className='ad-float-right'>{courseStatus}</span>
      </h1>
      <Row gutter={20}>
        <Col span={7}>{renderMenu()}</Col>
        <Col span={17}>
          {renderCurrentSection()}
          {renderCurrentSectionTypeDropdown()}
        </Col>
      </Row>
      <div className='ad-layout-admin-courseDetail-footer'>
        <div className='ad-btn-group'>
          <Btn feature='action' onClick={() => editCourseChapter()}>
            Save
          </Btn>
          <Btn feature='primary'>Reset</Btn>
        </div>
      </div>
    </div>
  )
}
export default CourseDetail

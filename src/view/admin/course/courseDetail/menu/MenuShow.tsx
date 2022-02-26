import { useState, useEffect, useContext } from 'react'
import { MyContext } from 'storage'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import CourseApi from 'api/admin/CourseApi'

import Header from 'view/user/layout/Header'
import AdminSideBar from '../../../AdminSideBar'
import Section from '../section/Section'
import ModalMenuEdit from '../menuEdit/ModalMenuEdit'

import { IconLevels } from 'utility/icon'
import { Btn, UploadVideo } from 'utility/component'
import { Row, Col, Breadcrumb, message, Menu } from 'antd'
const { SubMenu } = Menu

interface IProps {
  isModalMenuEditShow: boolean
}

const MenuShow = (props: IProps) => {
  const context = useContext(MyContext)
  const api = new CourseApi()
  const history = useHistory()
  const { courseId, sectionId } =
    useParams<{ courseId: string; sectionId?: string }>()

  // course detail and menu
  const [menu, setMenu] = useState<any>([])
  const [menuOpenKeys, setMenuOpenKeys] = useState<any>([])
  const openAllMenuItems = (menu: any) => {
    let menuOpenKeys: string[] = []
    for (const chapter of menu) {
      menuOpenKeys.push(chapter.key)
      for (const section of chapter.children) {
        menuOpenKeys.push(section.key)
      }
    }
    setMenuOpenKeys(menuOpenKeys)
  }
  const parseItemIdToKey = (sectionId: string) => {
    for (const group of menu) {
      for (const chapter of group.children) {
        for (const section of chapter.children) {
          if (section.id === sectionId) {
            return section.key
          }
        }
      }
    }
  }
  const getCourseDetailMenu = () => {
    api
      .getCourseDetailMenu('MENU', courseId)
      .then((res: any) => {
        setMenu(res.data)
        openAllMenuItems(res.data)
      })
      .finally(() => context.setIsLoading(false))
  }

  // init page
  useEffect(() => {
    if (courseId || !props.isModalMenuEditShow) getCourseDetailMenu()
  }, [courseId, props.isModalMenuEditShow]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (menu.length > 0 && !sectionId) {
      // 若網址無 sectionId ，則抓第一個做為預設的
      let firstSectionId: string = ''
      for (const group of menu) {
        for (const chapter of group.children) {
          for (const section of chapter.children) {
            if (section.level === 3) {
              firstSectionId = section.id
              break
            }
            break
          }
          break
        }
      }
      history.push(`/admin/courseDetail/${courseId}/${firstSectionId}`)
    }
  }, [menu]) // eslint-disable-line react-hooks/exhaustive-deps

  // render
  return menu?.length > 0 ? (
    <div className='ad-layout-admin-article-menu'>
      <Menu
        className='ad-menu-user-course'
        onOpenChange={(keys: any) => setMenuOpenKeys(keys)}
        openKeys={menuOpenKeys}
        selectedKeys={[sectionId ? parseItemIdToKey(sectionId) : '']}
        mode='inline'
      >
        {menu.map((group: any) => (
          <SubMenu key={group.key} icon={<IconLevels />} title={group.name}>
            {group.children?.map((chapter: any) => (
              <SubMenu key={chapter.key} title={chapter.name}>
                {chapter.children?.map((section: any) => (
                  <Menu.Item
                    key={section.key}
                    onClick={() => {
                      history.push(
                        `/admin/courseDetail/${courseId}/${section.id}`
                      )
                    }}
                  >
                    <div>{section.name}</div>
                  </Menu.Item>
                ))}
              </SubMenu>
            ))}
          </SubMenu>
        ))}
      </Menu>
    </div>
  ) : null
}
export default MenuShow

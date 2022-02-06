import { useState, useEffect, useContext } from 'react'
import { MyContext, StaticService } from 'storage'
import { useHistory, useLocation } from 'react-router-dom'
import CourseApi from 'api/user/CourseApi'
import Header from 'view/layout/Header'
import Footer from 'view/layout/Footer'
import { Btn } from 'utility/component'
import CS from 'assets/img/temp-cs.jpeg'
import { Row, Col, Breadcrumb, Pagination, Menu } from 'antd'

interface IState {
  coursesType: string
}

const AccountSideBar = () => {
  const context = useContext(MyContext)
  const api = new CourseApi()
  const history = useHistory()
  const location = useLocation()

  const [menu, setMenu] = useState<any>([
    'Learning profile',
    'Purchase details',
    'Change password'
  ])
  const [menuOpenKeys, setMenuOpenKeys] = useState<any>([])

  return (
    <Menu
      className='ad-menu-user-course ad-menu-user-account-sideBar'
      onOpenChange={(keys: any) => setMenuOpenKeys(keys)}
      openKeys={menuOpenKeys}
      selectedKeys={['Learning profile']}
      mode='inline'
    >
      {menu.map((item: any) => (
        <Menu.Item
          key={item}
          // onClick={() =>
          //   history.push(`/courseDetail/${courseId}/${section.id}`)
          // }
        >
          <div>{item}</div>
        </Menu.Item>
      ))}
    </Menu>
  )
}
export default AccountSideBar

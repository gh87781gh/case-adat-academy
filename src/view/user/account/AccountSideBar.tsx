import { useState, useEffect, useContext } from 'react'
import { MyContext, StaticService } from 'storage'
import { useHistory, useLocation } from 'react-router-dom'
import CourseApi from 'api/user/CourseApi'
import Header from 'view/Header'
import Footer from 'view/user/layout/Footer'
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

  const menu = [
    { name: 'Learning profile', path: '/account/learningProfile' },
    { name: 'Purchase details', path: '/account/courseManagement' },
    { name: 'Change password', path: '/account/changePassword' }
  ]
  const [menuOpenKeys, setMenuOpenKeys] = useState<any>([])

  return (
    <Menu
      className='ad-menu-user-course ad-menu-user-account-sideBar'
      onOpenChange={(keys: any) => setMenuOpenKeys(keys)}
      openKeys={menuOpenKeys}
      selectedKeys={[menu[0].name]}
      mode='inline'
    >
      {menu.map((item: any) => (
        <Menu.Item key={item.name} onClick={() => history.push(item.path)}>
          <div>{item.name}</div>
        </Menu.Item>
      ))}
    </Menu>
  )
}
export default AccountSideBar

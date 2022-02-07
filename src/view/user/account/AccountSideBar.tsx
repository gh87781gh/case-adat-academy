import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Menu } from 'antd'

interface IState {
  coursesType: string
}

const AccountSideBar = () => {
  const history = useHistory()

  const menu = [
    { name: 'Learning profile', path: '/account/learningProfile' },
    { name: 'Purchase details', path: '/account/purchaseDetail' },
    { name: 'Change password', path: '/account/changePassword' }
  ]
  const [menuOpenKeys, setMenuOpenKeys] = useState<any>(menu[0].name)

  return (
    <Menu
      className='ad-menu-user-course ad-menu-user-account-sideBar'
      onClick={(e: any) => setMenuOpenKeys(e.key)}
      selectedKeys={[menuOpenKeys]}
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

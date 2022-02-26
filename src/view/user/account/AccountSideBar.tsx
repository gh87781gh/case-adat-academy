import { useHistory, useLocation } from 'react-router-dom'
import { Menu } from 'antd'

const AccountSideBar = () => {
  const history = useHistory()
  const location = useLocation()

  const menu = [
    { name: 'Learning profile', path: '/account/learningProfile' },
    { name: 'Purchase details', path: '/account/purchaseDetail' },
    { name: 'Change password', path: '/account/changePassword' }
  ]

  return (
    <Menu
      className='ad-menu-user-course ad-menu-user-account-sideBar'
      selectedKeys={[location.pathname]}
      mode='inline'
    >
      {menu.map((item: any) => (
        <Menu.Item key={item.path} onClick={() => history.push(item.path)}>
          <div>{item.name}</div>
        </Menu.Item>
      ))}
    </Menu>
  )
}
export default AccountSideBar

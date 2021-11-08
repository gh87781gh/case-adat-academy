import { useContext } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { LogoADAT } from '../../utility/icon'
import { IconSearch, IconArrowDown } from '../../utility/icon'
import { Input, Button, Menu, Dropdown } from 'antd'
import { MyContext, BrowserStorage } from '../../storage'
import { version } from '../../../package.json'

const Header = () => {
  const context = useContext(MyContext)
  const browserStorage = new BrowserStorage()
  const history = useHistory()
  const location = useLocation()

  const logout = () => {
    browserStorage.removeStorage('AUTH')
    history.push('/login')
  }

  const menu = () => {
    return (
      <Menu className='ad-header-profile-menu'>
        <Menu.Item className='ad-header-profile-menu-text' key='user' disabled>
          {context.auth.user_id} <br />
          <span className='ad-header-profile-menu-decs'>user ID</span>
        </Menu.Item>
        <Menu.Item key='learning profile'>learning profile</Menu.Item>
        <Menu.Item key='course management'>course management</Menu.Item>
        <Menu.Item className='ad-header-profile-menu-bd' key='change password'>
          change password
        </Menu.Item>
        {context.auth.is_admin ? (
          <Menu.Item
            key='admin'
            onClick={() => history.push('/admin/purchase')}
          >
            Admin
          </Menu.Item>
        ) : null}
        <Menu.Item
          className='ad-header-profile-menu-bd'
          key='log out'
          onClick={logout}
        >
          log out
        </Menu.Item>
        <Menu.Item key='version' disabled>
          <span className='ad-header-profile-menu-decs'>v{version}</span>
        </Menu.Item>
      </Menu>
    )
  }

  return (
    <header className='ad-header'>
      <div className='ad-layout-container ad-header-container'>
        {/* TODO switch logo */}
        {/* <div className='ad-header-container-logo'> */}
        <div className='ad-header-container-logo-primary'>
          <LogoADAT />
        </div>
        <ul className='ad-header-tabHead'>
          <li
            className={`ad-header-btn ${
              location.pathname === '/index' ? 'active' : ''
            }`}
            onClick={() => history.push('/index')}
          >
            Course
          </li>
          <li
            className={`ad-header-btn ${
              location.pathname === '/help' ? 'active' : ''
            }`}
            onClick={() => history.push('/help')}
          >
            Help center
          </li>
        </ul>
        <div className='ad-header-searchBar'>
          <Input placeholder='Search course content' />
          <Button type='primary' icon={<IconSearch />} />
        </div>
        <Dropdown overlay={menu()} trigger={['click']}>
          <div className='ad-header-btn'>
            {context.auth.user_id}
            <IconArrowDown />
          </div>
        </Dropdown>
      </div>
    </header>
  )
}
export default Header

import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { LogoADAT } from '../../utility/icon'
import { IconSearch, IconArrowDown } from '../../utility/icon'
import { Input, Button, Menu, Dropdown } from 'antd'
import { MyContext } from '../../storage'

// interface IProps {}
// interface IState {}

const Header = () => {
  const context = useContext(MyContext)
  const history = useHistory()

  const logout = () => {
    // TODO api?
    history.push('/login')
  }

  const menu = () => {
    return (
      <Menu className='ad-header-profile-menu'>
        <Menu.Item className='ad-header-profile-menu-text' key='user' disabled>
          {/* TODO name */}
          {context.auth.user_id} <br />
          <span>{context.auth.user_id}</span>
        </Menu.Item>
        <Menu.Item key='learning profile'>learning profile</Menu.Item>
        <Menu.Item key='course management'>course management</Menu.Item>
        <Menu.Item key='change password'>change password</Menu.Item>
        <Menu.Item key='-'>---------------</Menu.Item>
        <Menu.Item key='log out' onClick={logout}>
          log out
        </Menu.Item>
      </Menu>
    )
  }

  return (
    <header className='ad-header'>
      <div className='ad-container ad-header-container'>
        {/* TODO switch logo */}
        {/* <div className='ad-header-container-logo'> */}
        <div className='ad-header-container-logo-primary'>
          <LogoADAT />
        </div>
        <ul className='ad-header-tabHead'>
          <li className='ad-header-btn ad-header-btn-active'>Course</li>
          <li className='ad-header-btn'>Help center</li>
        </ul>
        <div className='ad-header-searchBar'>
          <Input placeholder='Search course content' />
          <Button type='primary' icon={<IconSearch />} />
        </div>
        <Dropdown overlay={menu()} trigger={['click']}>
          <div
            className='ad-header-btn'
            // onClick={(e) => e.preventDefault()} TODO
          >
            {/* TODO name */}
            {context.auth.user_id}
            <IconArrowDown />
          </div>
        </Dropdown>
      </div>
    </header>
  )
}
export default Header

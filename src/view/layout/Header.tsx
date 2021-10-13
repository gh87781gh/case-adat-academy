import { LogoADAT } from '../../utility/icon'
import { IconSearch, IconArrowDown } from '../../utility/icon'
import { Input, Button, Menu, Dropdown } from 'antd'

// interface IProps {}
// interface IState {}

// TODO need to add Auth validate rule
const Header = () => {
  // const handleClick = (e: any) => {
  //   console.log('click ', e)
  //   // this.setState({ current: e.key })
  // }

  const menu = () => {
    return (
      <Menu className='ad-header-profile-menu'>
        <Menu.Item className='ad-header-profile-menu-text' key='user' disabled>
          echochuang <br />
          <span>user ID</span>
        </Menu.Item>
        <Menu.Item key='learning profile'>learning profile</Menu.Item>
        <Menu.Item key='course management'>course management</Menu.Item>
        <Menu.Item key='change password'>change password</Menu.Item>
        <Menu.Item key='-'>---------------</Menu.Item>
        <Menu.Item key='log out'>log out</Menu.Item>
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
            EchoChuang
            <IconArrowDown />
          </div>
        </Dropdown>
      </div>
    </header>
  )
}
export default Header

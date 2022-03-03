import { useContext, useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { version } from '../../../../package.json'
import { MyContext } from '../../../storage'

import useScrolling from 'utility/hook/useScrolling'
import { Btn } from 'utility/component'
import { IconSearch, IconArrowDown, IconADATFull } from 'utility/icon'
import { Input, Menu, Dropdown } from 'antd'

interface IState {
  text: string
}

const Header = () => {
  const context = useContext(MyContext)
  const history = useHistory()
  const location = useLocation()
  const { scrollY } = useScrolling()

  // data
  const [data, setData] = useState<IState>({
    text: ''
  })
  const onChange = (key: string, e: any) => {
    let value = e.target.value
    // TODO
    // if (value) {
    //   switch (key) {
    //     case 'text':
    //       if (value && !ValidateStr('isEngInt', value)) return false
    //       value = value.toLowerCase()
    //       break
    //     case 'email':
    //   }
    // }
    setData({ ...data, [key]: value })
  }

  // api
  const logout = () => {
    history.push('/login/successfully/loggedOut')
  }

  // scrolling style change
  const [isScrolling, setIsScrolling] = useState<boolean>(false)
  useEffect(() => {
    const page = location.pathname.split('/')[1]
    if (page === 'course' || page === 'courseDetail') {
      if (scrollY === 0 || scrollY === 90) {
        setIsScrolling(false)
      } else {
        setIsScrolling(!(scrollY <= 0))
      }
    } else {
      setIsScrolling(true)
    }
  }, [scrollY]) // eslint-disable-line react-hooks/exhaustive-deps

  const renderMenu = () => {
    return (
      <Menu className='ad-header-profile-menu'>
        <Menu.Item className='ad-header-profile-menu-text' key='user' disabled>
          {context.auth?.user_id} <br />
          <span className='ad-header-profile-menu-decs'>user ID</span>
        </Menu.Item>
        <Menu.Item
          key='learning profile'
          onClick={() => history.push('/account/learningProfile')}
        >
          learning profile
        </Menu.Item>
        <Menu.Item
          key='course management'
          onClick={() => history.push('/account/purchaseDetail')}
        >
          purchase detail
        </Menu.Item>
        <Menu.Item
          className='ad-header-profile-menu-bd'
          key='change password'
          onClick={() => history.push('/account/changePassword')}
        >
          change password
        </Menu.Item>
        {context.auth?.is_admin ? (
          <Menu.Item
            key='admin'
            onClick={() => history.push('/admin/purchase')}
          >
            Admin
          </Menu.Item>
        ) : null}
        <Menu.Item key='log out' onClick={logout}>
          log out
        </Menu.Item>
      </Menu>
    )
  }
  return (
    <header className='ad-header'>
      <div className='ad-layout-container ad-header-container'>
        <div
          className={`ad-header-container-logo-primary ${
            isScrolling ? 'scroll-mode' : ''
          }`}
          onClick={() => history.push('/course')}
        >
          <IconADATFull />
        </div>
        <ul className='ad-header-tabHead'>
          <li
            className={`ad-header-btn ${
              location.pathname === '/course' ? 'active' : ''
            }`}
            onClick={() => history.push('/course')}
          >
            Course
          </li>
          <li
            className={`ad-header-btn ${
              location.pathname === '/help' ? 'active' : ''
            }`}
            onClick={() => history.push('/helpCenter')}
          >
            Help center
          </li>
        </ul>
        <div className='ad-header-searchBar'>
          <Input
            placeholder='Search course content'
            value={data.text}
            onChange={(e) => onChange('text', e)}
          />
          <Btn
            feature='action'
            onClick={() => {
              if (data.text) history.push(`/search/${data.text}`)
            }}
            icon={<IconSearch />}
          />
        </div>
        <Dropdown overlay={renderMenu()} trigger={['click']}>
          <div className='ad-header-btn'>
            {context.auth?.user_id}
            <IconArrowDown />
          </div>
        </Dropdown>
      </div>
      <span className='ad-layout-version'>v{version}</span>
    </header>
  )
}
export default Header

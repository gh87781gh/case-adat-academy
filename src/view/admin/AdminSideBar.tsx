import { useState, useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'

const AdminSideBar = () => {
  const location = useLocation()
  const history = useHistory()

  const menu = [
    {
      name: 'Purchase management',
      childPage: ['purchase']
    },
    {
      name: 'Account management',
      childPage: ['account']
    },
    {
      name: 'Course management',
      childPage: ['course', 'courseDetail']
    },
    {
      name: 'Admin management',
      childPage: ['admin']
    }
  ]
  const [activePath, setActivePath] = useState<string>()
  useEffect(() => {
    const ary = location.pathname.split('/')
    setActivePath(ary[2])
  }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ul className='ad-sideBar'>
      {menu.map((item: any) => (
        <li
          className={item.childPage.includes(activePath) ? 'active' : ''}
          key={item.name}
          onClick={() => history.push(`/admin/${item.childPage[0]}`)}
        >
          {item.name}
        </li>
      ))}
    </ul>
  )
}
export default AdminSideBar

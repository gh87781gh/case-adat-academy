import { useState, useEffect } from 'react'
import { useLocation, useHistory, useParams } from 'react-router-dom'

const AdminSideBar = () => {
  const location = useLocation()
  const history = useHistory()
  const { courseId } = useParams<{ courseId: string }>()

  const [activePath, setActivePath] = useState<string>()

  const menu = [
    {
      name: 'Purchase management',
      path: '/admin/purchase'
    },
    {
      name: 'Account management',
      path: '/admin/account'
    },
    {
      name: 'Course management',
      path: '/admin/course'
    },
    {
      name: 'Admin management',
      path: '/admin/admin'
    }
  ]

  useEffect(() => {
    if (courseId) {
      setActivePath(location.pathname.replace(`/${courseId}`, ''))
    } else {
      setActivePath(location.pathname)
    }
  }, [location, courseId]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <ul className='ad-sideBar'>
        {menu.map((item: any) => (
          <li
            className={item.path === activePath ? 'active' : ''}
            key={item.name}
            onClick={() => history.push(item.path)}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </>
  )
}
export default AdminSideBar

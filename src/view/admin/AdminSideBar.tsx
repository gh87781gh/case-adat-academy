import { useLocation, useHistory } from 'react-router-dom'

const AdminSideBar = () => {
  const location = useLocation()
  const history = useHistory()

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
  return (
    <>
      <ul className='ad-sideBar'>
        {menu.map((item: any) => (
          <li
            className={item.path === location.pathname ? 'active' : ''}
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

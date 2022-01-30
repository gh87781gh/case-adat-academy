import { useState, useEffect, useContext } from 'react'
import { useLocation, useHistory, useParams } from 'react-router-dom'
import { MyContext } from 'storage'

let adminValidateDelateTimer: any = null

const AdminSideBar = () => {
  const context = useContext(MyContext)
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
    // 如果進入 admin 介面，但卻偵測到沒有 is_admin 的身份，導回首頁
    // context 資料進入慢，給 3 秒緩衝時間（考量 render 順序）
    clearTimeout(adminValidateDelateTimer)
    adminValidateDelateTimer = setTimeout(function () {
      if (!context.auth.is_admin) {
        history.push('/course')
      }
    }, 30000)

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

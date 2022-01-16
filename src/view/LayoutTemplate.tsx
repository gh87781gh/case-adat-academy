import { useState, useEffect } from 'react'
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import { version } from '../../package.json'
import { MyContext, BrowserStorage } from '../storage'
import GlobalApi from '../api/GlobalApi'

// no validate auth
import Login from './login/Login'
import DemoPage from './DemoPage'

// user console
import Course from './user/course/Index'
import CourseDetail from './user/course/courseDetail/CourseDetail'
import Bookmark from './user/course/bookmark/Bookmark'

// admin console
import AdminPurchase from './admin/purchase/Index'
import AdminAccount from './admin/account/Index'
import AdminCourse from './admin/course/Index'
import AdminAdmin from './admin/admin/Index'

import { Spin } from 'antd'

const LayoutTemplate = () => {
  const browserStorage = new BrowserStorage()
  const api = new GlobalApi()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [auth, setAuth] = useState<any>({})
  const getAuth = () => {
    setIsLoading(true)
    api
      .getAuth()
      .then((res: any) => setAuth(res.data))
      .finally(() => setIsLoading(false))
  }
  useEffect(() => {
    if (browserStorage.getStorage('AUTH')) getAuth()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const componentPage = (Component: any, pageType: string, props?: any) => {
    const token = browserStorage.getStorage('AUTH')
    if ((pageType === 'USER' || pageType === 'ADMIN') && !token) {
      return <Redirect to='/login' />
    } else if (pageType === 'ADMIN' && !auth.is_admin) {
      return <Redirect to='/index' />
    } else {
      return <Component {...props} />
    }
  }

  return (
    <>
      <MyContext.Provider
        value={{
          setIsLoading,
          auth,
          getAuth
        }}
      >
        <Spin className='ad-spin-global' spinning={isLoading} size='large'>
          <HashRouter>
            <Switch>
              <Route
                exact={true}
                path='/demo'
                render={() => componentPage(DemoPage, 'LOGIN')}
              />
              <Route
                exact={true}
                path='/login'
                render={() => componentPage(Login, 'LOGIN')}
              />
              <Route
                exact={true}
                path='/index'
                render={() => componentPage(Course, 'USER')}
              />
              <Route
                exact={true}
                path='/index/course/:courseId'
                render={() => componentPage(CourseDetail, 'USER')}
              />
              <Route
                exact={true}
                path='/index/bookmark'
                render={() => componentPage(Bookmark, 'USER')}
              />
              <Route
                exact={true}
                path='/admin/purchase/:id?'
                render={() => componentPage(AdminPurchase, 'ADMIN')}
              />
              <Route
                exact={true}
                path='/admin/account'
                render={() => componentPage(AdminAccount, 'ADMIN')}
              />
              <Route
                exact={true}
                path='/admin/course/:courseId?'
                render={() => componentPage(AdminCourse, 'ADMIN')}
              />
              <Route
                exact={true}
                path='/admin/admin'
                render={() => componentPage(AdminAdmin, 'ADMIN')}
              />
              <Redirect to='/login' />
            </Switch>
          </HashRouter>
          <span className='ad-layout-version'>v{version}</span>
        </Spin>
      </MyContext.Provider>
    </>
  )
}
export default LayoutTemplate

import { useState, useEffect } from 'react'
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import { version } from '../../package.json'
import { MyContext, BrowserStorage } from '../storage'
import GlobalApi from '../api/GlobalApi'

// no validate auth
import DemoPage from './DemoPage' // only for local
import Login from './login/login/Login'
import SignUp1 from './login/signUp/SignUp1'
import SignUp2 from './login/signUp/SignUp2'
import SignUpConfirm from './login/signUp/SignUpConfirm'
import PasswordRecover1 from './login/password/PasswordRecover1'
import PasswordRecover2 from './login/password/PasswordRecover2'
import PasswordRecover3 from './login/password/PasswordRecover3'

// user console
import Course from './user/course/Index'
import CourseDetail from './user/course/courseDetail/CourseDetail'
import Bookmark from './user/course/bookmark/Bookmark'
import Search from './user/search/Index'
import HelpCenter from './user/helpCenter/Index'
import ContactUs from './user/helpCenter/contact/ContactUs'
import NoResult from './layout/NoResult'
import NoAccess from './layout/NoAccess'

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
      return <Redirect to='/course' />
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
              {process.env.REACT_APP_ENV === 'LOCAL' ? (
                <Route
                  exact={true}
                  path='/demo'
                  render={() => componentPage(DemoPage, 'LOGIN')}
                />
              ) : null}

              {/* NOTE LOGIN */}
              <Route
                exact={true}
                path='/login'
                render={() => componentPage(Login, 'LOGIN')}
              />
              <Route
                exact={true}
                path='/login/signUp1'
                render={() => componentPage(SignUp1, 'LOGIN')}
              />
              <Route
                exact={true}
                path='/login/signUp2'
                render={() => componentPage(SignUp2, 'LOGIN')}
              />
              <Route
                exact={true}
                path='/login/signUpConfirm'
                render={() => componentPage(SignUpConfirm, 'LOGIN')}
              />
              <Route
                exact={true}
                path='/login/passwordRecover1'
                render={() => componentPage(PasswordRecover1, 'LOGIN')}
              />
              <Route
                exact={true}
                path='/login/passwordRecover2'
                render={() => componentPage(PasswordRecover2, 'LOGIN')}
              />
              <Route
                exact={true}
                path='/login/passwordRecover3'
                render={() => componentPage(PasswordRecover3, 'LOGIN')}
              />

              {/* NOTE USER */}
              <Route
                exact={true}
                path='/course/'
                render={() => componentPage(Course, 'USER')}
              />
              <Route
                exact={true}
                path='/courseDetail/:courseId'
                render={() => componentPage(CourseDetail, 'USER')}
              />
              <Route
                exact={true}
                path='/bookmark'
                render={() => componentPage(Bookmark, 'USER')}
              />
              <Route
                exact={true}
                path='/search'
                render={() => componentPage(Search, 'USER')}
              />
              <Route
                exact={true}
                path='/helpCenter'
                render={() => componentPage(HelpCenter, 'USER')}
              />
              <Route
                exact={true}
                path='/contactUs'
                render={() => componentPage(ContactUs, 'USER')}
              />
              <Route
                exact={true}
                path='/noResult'
                render={() => componentPage(NoResult, 'USER')}
              />
              <Route
                exact={true}
                path='/noAccess'
                render={() => componentPage(NoAccess, 'USER')}
              />

              {/* NOTE ADMIN */}
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

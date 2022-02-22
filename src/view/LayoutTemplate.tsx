import { useState, useEffect } from 'react'
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import { MyContext, BrowserStorage } from '../storage'
import GlobalApi from '../api/GlobalApi'

// no validate auth
import DemoPage from './DemoPage' // only for local
import RedirectPage from './user/layout/RedirectPage'
import Login from './login/login/Login'
import LoginConfirm from './login/login/Confirmation'
import SignUp1 from './login/signUp/SignUp1'
import SignUp2 from './login/signUp/SignUp2'
import SignUpConfirm from './login/signUp/SignUpConfirm'
import PasswordRecover1 from './login/password/PasswordRecover1'
import PasswordRecover2 from './login/password/PasswordRecover2'
import PasswordRecover3 from './login/password/PasswordRecover3'
import Contact from './login/contact/Contact'
import Successfully from './login/Successfully'

// user console
import Course from './user/course/Index'
import CourseDetail from './user/course/courseDetail/CourseDetail'
import Bookmark from './user/course/bookmark/Bookmark'
import Search from './user/search/Index'
import HelpCenter from './user/helpCenter/Index'
import ContactUs from './user/helpCenter/contactUs/ContactUs'
import LearningProfile from './user/account/learningProfile/Index'
import PurchaseDetail from './user/account/purchaseDetail/Index'
import ChangePassword from './user/account/changePassword/Index'
import NoResult from './user/layout/NoResult'
import NoAccess from './user/layout/NoAccess'

// admin console
import AdminPurchase from './admin/purchase/Index'
import AdminPurchaseAccount from './admin/purchase/purchaseAccount/PurchaseAccount'
import AdminAccount from './admin/account/Index'
import AdminCourse from './admin/course/Index'
import AdminCourseDetail from './admin/course/courseDetail/CourseDetail'
import AdminCourseLearningPath from './admin/course/learningPath/LearningPath'
import AdminAdmin from './admin/admin/Index'

import { Spin, message } from 'antd'

const LayoutTemplate = () => {
  const browserStorage = new BrowserStorage()
  const api = new GlobalApi()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [auth, setAuth] = useState<any>({})
  const getAuth = () => {
    setIsLoading(true)
    api
      .getAuth()
      .then((res: any) => {
        setAuth(res.data)
      })
      .finally(() => setIsLoading(false))
  }
  useEffect(() => {
    if (browserStorage.getStorage('AUTH')) getAuth()
  }, [browserStorage.getStorage('AUTH')]) // eslint-disable-line react-hooks/exhaustive-deps

  const componentPage = (Component: any, pageType?: string, props?: any) => {
    const token = browserStorage.getStorage('AUTH')
    if ((pageType === 'USER' || pageType === 'ADMIN') && !token) {
      return <Redirect to='/login' />
    } else if (pageType === 'ADMIN' && auth.is_admin === false) {
      return <Redirect to='/course' />
    } else {
      if (pageType === 'USER' || pageType === 'ADMIN') {
        return (
          <div className='main'>
            <Component {...props} />
          </div>
        )
      } else {
        return <Component {...props} />
      }
    }
  }

  return (
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
                render={() => componentPage(DemoPage)}
              />
            ) : null}

            {/* NOTE LOGIN */}
            <Route
              // exact={false}
              path='/redirect/:target/:verify'
              render={() => componentPage(RedirectPage)}
            />
            <Route
              exact={true}
              path='/login'
              render={() => componentPage(Login, 'LOGIN')}
            />
            <Route
              exact={true}
              path='/login/loginConfirm/:type'
              render={() => componentPage(LoginConfirm, 'LOGIN')}
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
              path='/login/passwordRecover3/:tempPassword?'
              render={() => componentPage(PasswordRecover3, 'LOGIN')}
            />
            <Route
              exact={true}
              path='/login/contact'
              render={() => componentPage(Contact, 'LOGIN')}
            />
            <Route
              exact={true}
              path='/login/successfully/:type'
              render={() => componentPage(Successfully, 'LOGIN')}
            />

            {/* NOTE USER */}
            <Route
              exact={true}
              path='/course'
              render={() => componentPage(Course, 'USER')}
            />
            <Route
              exact={true}
              path='/courseDetail/:courseId/:sectionId?'
              render={() => componentPage(CourseDetail, 'USER')}
            />
            <Route
              exact={true}
              path='/bookmark'
              render={() => componentPage(Bookmark, 'USER')}
            />
            <Route
              exact={true}
              path='/search/:text'
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
              path='/account/learningProfile'
              render={() => componentPage(LearningProfile, 'USER')}
            />
            <Route
              exact={true}
              path='/account/purchaseDetail'
              render={() => componentPage(PurchaseDetail, 'USER')}
            />
            <Route
              exact={true}
              path='/account/changePassword'
              render={() => componentPage(ChangePassword, 'USER')}
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
              path='/admin/purchaseAccount/:purchaseId?'
              render={() => componentPage(AdminPurchaseAccount, 'ADMIN')}
            />
            <Route
              exact={true}
              path='/admin/account'
              render={() => componentPage(AdminAccount, 'ADMIN')}
            />
            <Route
              exact={true}
              path='/admin/course'
              render={() => componentPage(AdminCourse, 'ADMIN')}
            />
            <Route
              exact={true}
              path='/admin/courseDetail/:courseId/:sectionId?'
              render={() => componentPage(AdminCourseDetail, 'ADMIN')}
            />
            <Route
              exact={true}
              path='/admin/course/learningPath'
              render={() => componentPage(AdminCourseLearningPath, 'ADMIN')}
            />
            <Route
              exact={true}
              path='/admin/admin'
              render={() => componentPage(AdminAdmin, 'ADMIN')}
            />
            <Redirect to='/login' />
          </Switch>
        </HashRouter>
      </Spin>
    </MyContext.Provider>
  )
}
export default LayoutTemplate

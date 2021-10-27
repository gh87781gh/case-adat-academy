import { useState } from 'react'
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import Login from './login/Login'
import Admin from './admin/Admin'
import User from './user/User'
import { Spin } from 'antd'
import { MyContext, BrowserStorage } from '../storage'

const LayoutTemplate = () => {
  const browserStorage = new BrowserStorage()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [auth, setAuth] = useState<any>({})

  const componentPage = (Component: any, isAuth: boolean, props?: any) => {
    return isAuth && !browserStorage.getStorage('AUTH') ? (
      <Redirect to='/login' />
    ) : (
      <Component {...props} />
    )
  }

  return (
    <>
      <MyContext.Provider
        value={{
          setIsLoading,
          auth,
          setAuth
        }}
      >
        <Spin className='ad-spin-global' spinning={isLoading} size='large'>
          <HashRouter>
            <Switch>
              <Route path='/login' render={() => componentPage(Login, false)} />
              <Route
                exact={true}
                path='/index'
                render={() => componentPage(User, true)}
              />
              <Route
                exact={true}
                path='/admin'
                render={() => componentPage(Admin, true)}
              />
              <Redirect to='/login' />
            </Switch>
          </HashRouter>
        </Spin>
      </MyContext.Provider>
    </>
  )
}
export default LayoutTemplate

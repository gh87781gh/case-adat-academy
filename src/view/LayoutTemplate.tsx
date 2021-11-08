import { useState, useEffect } from 'react'
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import GlobalApi from '../api/GlobalApi'
import Login from './login/Login'
import Purchase from './admin/purchase/Index'
import Account from './admin/account/Index'
import User from './user/User'
import { Spin } from 'antd'
import { MyContext, BrowserStorage } from '../storage'

const LayoutTemplate = () => {
  const browserStorage = new BrowserStorage()
  const api = new GlobalApi()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [auth, setAuth] = useState<any>({})
  const getAuth = () => {
    setIsLoading(true)
    api
      .getAuth()
      .then((res: any) => setAuth(res))
      .finally(() => setIsLoading(false))
  }
  useEffect(() => {
    if (browserStorage.getStorage('AUTH')) getAuth()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const componentPage = (Component: any, authType: string, props?: any) => {
    const token = browserStorage.getStorage('AUTH')
    return (authType !== 'LOGIN' && !token) ||
      (authType === 'ADMIN' && token && !auth) ? (
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
          getAuth
        }}
      >
        <Spin className='ad-spin-global' spinning={isLoading} size='large'>
          <HashRouter>
            <Switch>
              <Route
                // exact={true}
                path='/login'
                render={() => componentPage(Login, 'LOGIN')}
              />
              <Route
                exact={true}
                path='/index'
                render={() => componentPage(User, 'USER')}
              />
              <Route
                exact={true}
                path='/admin/purchase/:id?'
                render={() => componentPage(Purchase, 'ADMIN')}
              />
              <Route
                exact={true}
                path='/admin/account'
                render={() => componentPage(Account, 'ADMIN')}
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

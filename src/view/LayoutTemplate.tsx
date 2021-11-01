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
      .then((res: any) => {
        setAuth(res)
      })
      .catch()
      .finally(() => {
        setIsLoading(false)
      })
  }
  useEffect(() => {
    if (browserStorage.getStorage('AUTH')) getAuth()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const componentPage = (Component: any, isAuth: boolean, props?: any) => {
    // TODO admin跟user的區別
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
          getAuth
        }}
      >
        <Spin className='ad-spin-global' spinning={isLoading} size='large'>
          <HashRouter>
            <Switch>
              <Route
                exact={true}
                path='/login'
                render={() => componentPage(Login, false)}
              />
              <Route
                exact={true}
                path='/index'
                render={() => componentPage(User, true)}
              />
              <Route
                exact={true}
                path='/admin/purchase/:id?'
                render={() => componentPage(Purchase, false)}
              />
              <Route
                exact={true}
                path='/admin/account'
                render={() => componentPage(Account, true)}
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

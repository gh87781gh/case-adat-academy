import { useState } from 'react'
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import Login from './login/Login'
import Admin from './admin/Admin'

import { Spin } from 'antd'
import { MyContext } from '../storage/storage'

const LayoutTemplate = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const componentPage = (Component: any, props: any) => {
    return <Component {...props} />
  }

  return (
    <>
      <MyContext.Provider
        value={{
          setIsLoading
        }}
      >
        <Spin className='ad-spin-global' spinning={isLoading} size='large'>
          <HashRouter>
            <Switch>
              <Route path='/login' render={componentPage.bind(this, Login)} />
              <Route
                exact={true}
                path='/admin'
                render={componentPage.bind(this, Admin)}
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

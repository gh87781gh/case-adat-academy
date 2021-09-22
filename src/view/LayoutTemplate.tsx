import { useState } from 'react'
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import Login from './login/Login';
// import LoginSuccessfully from './entry/login/LoginSuccessfully'
// import Create from './entry/create/Create'
// import CreateSuccessfully from './entry/create/CreateSuccessfully'
// import Recover from './entry/recover/Recover'
// import RecoverSend from './entry/recover/RecoverSend'
// import RecoverCopy from './entry/recover/RecoverCopy'
// import RecoverChange from './entry/recover/RecoverChange'
// import Contact from './entry/contact/Contact'
// import ContactSuccessfully from './entry/contact/ContactSuccessfully'
// import TermsPrivacy from './entry/terms&privacy/TermsPrivacy'
// import Index from './Index/Index'

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
          setIsLoading,
        }}
      >
        <Spin spinning={isLoading} size='large'>
          <HashRouter>
            <Switch>
              <Route
                path='/'
                exact={true}
                render={componentPage.bind(this, Login)}
              />
              <Redirect to='/' />
            </Switch>
          </HashRouter>
        </Spin>
      </MyContext.Provider>
    </>
  )
}
export default LayoutTemplate

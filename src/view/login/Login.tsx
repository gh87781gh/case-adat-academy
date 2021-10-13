import { Row, Col, Button } from 'antd'
import { Switch, Route, Redirect, useHistory } from 'react-router-dom'
import LoginEntry from './element/LoginEntry'
import Create from './element/Create'
import Contact from './element/Contact'
import Recover from './element/Recover'
import TermsPrivacy from './element/TermsPrivacy'

const Login = () => {
  const history = useHistory()

  return (
    <>
      <Row>
        <Col span={12} className='ad-login-col ad-login-pic'></Col>
        <Col span={12} className='ad-login-col ad-login-container'>
          <div style={{ width: '100%' }}>
            <Switch>
              <Route exact path={'/login'}>
                <LoginEntry />
              </Route>
              <Route exact path={'/login/create'}>
                <Create />
              </Route>
              <Route exact path={'/login/recover/:uuid?'}>
                <Recover />
              </Route>
              <Route exact path={'/login/contact'}>
                <Contact />
              </Route>
              <Route exact path={'/login/terms&privacy'}>
                <TermsPrivacy />
              </Route>
              <Redirect to='/login' />
            </Switch>
          </div>
          <div className='ad-login-footer'>
            <div className='ad-btn-group'>
              <Button
                type='link'
                onClick={() => history.push('/login/contact')}
              >
                Contact us
              </Button>
              <Button
                type='link'
                onClick={() => history.push('/login/terms&privacy')}
              >
                Terms & policy
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </>
  )
}
export default Login

import { Row, Col, Button } from 'antd'
import { Switch, Route, Redirect, useHistory } from 'react-router-dom'
import LoginEntry from './component/LoginEntry'
import Create from './component/Create'
import Contact from './component/Contact'
import Recover from './component/Recover'
import TermsPrivacy from './component/TermsPrivacy'

const Login = () => {
  const history = useHistory()

  return (
    <Row className='ad-login-bg'>
      <Col span={16} className='ad-login-container-box'>
        <div className='ad-login-container'>
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
      </Col>
      <Col span={8}>
        <div className='ad-login-footer'>
          <div className='ad-btn-group'>
            <Button type='link' onClick={() => history.push('/login/contact')}>
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
  )
}
export default Login

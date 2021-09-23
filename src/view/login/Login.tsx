import { Row, Col, Button } from 'antd'
import { Switch, Route, Redirect, useHistory } from 'react-router-dom'
import LoginEntry from './element/LoginEntry'
import Create from './element/Create'
import Contact from './element/Contact'
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
              <Route exact path={'/'}>
                <LoginEntry />
              </Route>
              <Route exact path={'/Create'}>
                <Create />
              </Route>
              <Route exact path={'/Contact'}>
                <Contact />
              </Route>
              <Route exact path={'/Terms&Privacy'}>
                <TermsPrivacy />
              </Route>
              <Redirect to={'/'} />
            </Switch>
          </div>
          <div className='ad-login-footer'>
            <div className='ad-btn-group'>
              <Button type='link' onClick={() => history.push('/Contact')}>
                Contact us
              </Button>
              <Button
                type='link'
                onClick={() => history.push('/Terms&Privacy')}
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

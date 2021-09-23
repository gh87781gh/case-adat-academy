import { Row, Col, Button } from 'antd'
import {
  Switch,
  Route,
  Redirect,
  useHistory,
  useRouteMatch
} from 'react-router-dom'
import LoginEntry from './element/LoginEntry'

const Login = () => {
  const history = useHistory()
  let { path } = useRouteMatch()

  return (
    <>
      <Row>
        <Col span={12} className='ad-login-col ad-login-pic'></Col>
        <Col span={12} className='ad-login-col ad-login-container'>
          <div style={{ width: '100%' }}>
            <Switch>
              <Route exact path={path}>
                <LoginEntry />
              </Route>
              <Route exact path={`${path}/Create`}>
                Create
              </Route>
              <Redirect to={path} />
            </Switch>
          </div>
          <div className='ad-login-footer'>
            <div className='ad-btn-group'>
              <Button type='link' onClick={() => history.push('/Contact')}>
                Contact us
              </Button>
              <Button type='link' onClick={() => history.push('/TermsPrivacy')}>
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

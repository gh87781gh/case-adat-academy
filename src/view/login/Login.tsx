import { Row, Col, Button } from 'antd'
import { HashRouter, Switch, Route, Redirect, useHistory } from 'react-router-dom'

interface IProps {
  content: any
}

const Login = (props: IProps) => {
  const history = useHistory()

  return (
    <>
      <Row>
        <Col span={12} className="ad-login-col ad-login-pic">
          {/* maybe a picture? */}
        </Col>
        <Col span={12} className="ad-login-col ad-login-container">
          <div style={{ width: '100%' }}>{props.content}</div>
          <div className="ad-login-footer">
            <div className="ad-btn-group">
              <Button type="link" onClick={() => history.push('/Contact')}>
                Contact us
              </Button>
              <Button type="link" onClick={() => history.push('/TermsPrivacy')}>
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

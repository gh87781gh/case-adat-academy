import { Row, Col, Button } from 'antd'
import { useHistory } from 'react-router-dom'
import { IconADAT } from 'utility/icon'

const LoginTemplate = (props: any) => {
  const history = useHistory()

  return (
    <Row className='ad-login-bg'>
      <Col span={16} className='ad-login-container-box'>
        <div className='ad-login-container'>{props.children}</div>
      </Col>
      <Col span={8} className='ad-login-footer'>
        <div className='ad-login-footer-logo'>
          <IconADAT />
        </div>
        <div className='ad-login-footer-btn-group'>
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
      </Col>
    </Row>
  )
}
export default LoginTemplate

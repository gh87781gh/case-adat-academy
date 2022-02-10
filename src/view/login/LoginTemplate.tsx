import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { BrowserStorage } from 'storage'
import { version } from '../../../package.json'

import { IconADAT } from 'utility/icon'
import { Btn } from 'utility/component'
import { Row, Col } from 'antd'

const LoginTemplate = (props: any) => {
  const history = useHistory()
  const browserStorage = new BrowserStorage()

  useEffect(() => {
    browserStorage.removeStorage('AUTH')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Row className='ad-login-bg'>
        <Col span={16} className='ad-login-container-box'>
          <div className='ad-login-container'>{props.children}</div>
        </Col>
        <Col span={8} className='ad-login-footer'>
          <div className='ad-login-footer-logo'>
            <IconADAT />
          </div>
          <div className='ad-login-footer-btn-group'>
            <Btn
              feature='link'
              className='ad-mode-dark'
              onClick={() => history.push('/login/contact')}
            >
              Contact us
            </Btn>
            <Btn
              feature='link'
              className='ad-mode-dark'
              onClick={() => history.push('/login/terms&privacyt')}
            >
              Terms & policy
            </Btn>
          </div>
        </Col>
      </Row>
      <span className='ad-layout-version'>v{version}</span>
    </>
  )
}
export default LoginTemplate

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
      <Row className='aa-login-bg'>
        <Col span={16} className='aa-login-container-box'>
          <div className='aa-login-container'>{props.children}</div>
        </Col>
        <Col span={8} className='aa-login-footer'>
          <div className='aa-login-footer-logo'>
            <IconADAT />
          </div>
          <div className='aa-login-footer-btn-group'>
            <Btn
              feature='link'
              className='aa-mode-dark'
              onClick={() => history.push('/login/contact')}
            >
              Contact us
            </Btn>
            <Btn
              feature='link'
              className='aa-mode-dark'
              onClick={() => history.push('/login/termsPolicy')}
            >
              Terms & policy
            </Btn>
          </div>
        </Col>
      </Row>
      <span className='aa-layout-version'>v{version}</span>
    </>
  )
}
export default LoginTemplate

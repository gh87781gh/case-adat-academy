import { useContext, useRef, useEffect } from 'react'

import { Btn } from 'utility/component'
import { IconADATFull, IconLinkedin, IconWeb } from 'utility/icon'
import { Button, Row, Col } from 'antd'

const Footer = () => {
  const inputEl = useRef<HTMLInputElement>(null)
  // window.addEventListener('scroll', function () {
  //   console.log(inputEl.current?.scrollTop)
  // })

  // useEffect(() => {
  //   console.log(inputEl.current?.scrollTop)
  // }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <footer ref={inputEl} className='ad-footer'>
      <div className='ad-layout-container'>
        <Row>
          <Col span={6}>
            <IconADATFull className='ad-footer-logo-adat' />
            <Row>
              <Col span={12}>
                <div className='ad-footer-share'>
                  <IconLinkedin /> <IconWeb />
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <p>
              R206, No.12, Nanke 2nd Rd., Xinshi Dist., Tainan City 741, R.O.C.
              (Taiwan)
            </p>
          </Col>
          <Col span={6}></Col>
          <Col span={6}>
            <p className='ad-footer-address'>
              EMAIL / adatservice@micb2b.com <br />
              TEL / +886-6-505-7624 <br />
              FAX / +886-6-505-7625
              {/* <br />
              <br />
              <Btn feature='link' className='ad-mode-dark'>
                Privacy policy
              </Btn> */}
            </p>
          </Col>
        </Row>
        <p>© ADAT Technology 2021</p>
      </div>
    </footer>
  )
}
export default Footer

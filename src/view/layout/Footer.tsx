import { LogoADAT } from '../../utility/icon'
// import {
//   IconSearch,
//   IconArrowDown,
//   IconWeb,
//   IconLinkedin,
// } from '../utility/svg/icon'
import { Input, Button, Menu, Dropdown, Row, Col } from 'antd'

// interface IProps {}
// interface IState {}

// TODO need to add Auth validate rule
const Footer = () => {
  return (
    <footer className='ad-footer'>
      <div className='ad-layout-container'>
        {/* TODO 大一點的logo？ */}
        <Row>
          <Col span={12}>
            <Row>
              <Col span={12}>
                {/* <LogoADAT className='ad-footer-logo' />
                <IconWeb className='ad-footer-link' />
                <IconLinkedin className='ad-footer-link' /> */}
              </Col>
              <Col span={12}>
                <p>
                  R206, No.12, Nanke 2nd Rd., Xinshi Dist., Tainan City 741,
                  R.O.C. (Taiwan)
                </p>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <p className='ad-footer-address'>
              EMAIL / adatservice@micb2b.com <br />
              TEL / +886-6-505-7624 <br />
              FAX / +886-6-505-7625
              <br />
              <br />
              <Button type='link'>Contact us</Button>
              <span className='ad-ml-1 ad-mr-1'>|</span>
              <Button type='link'>Terms & policy</Button>
            </p>
          </Col>
        </Row>
        <p>© ADAT Technology 2021</p>
      </div>
    </footer>
  )
}
export default Footer

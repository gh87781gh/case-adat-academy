import { useHistory } from 'react-router-dom'

import Header from 'view/user/layout/Header'
import Footer from 'view/user/layout/Footer'
import CS from 'assets/img/temp-cs.jpeg'

import { Btn } from 'utility/component'
import { Row, Col } from 'antd'

const HelpCenter = () => {
  const history = useHistory()

  const renderHelpCenterDesc = () => {
    return (
      <div className='aa-helpCenter-desc'>
        <p>
          We will try to reach you within <b>2</b> working days. Our team
          members are here for you:
        </p>
        <div className='aa-helpCenter-desc-cs'>
          <img src={CS} alt='' />
          <h4>Demmy</h4>
        </div>
        <div className='aa-helpCenter-desc-cs'>
          <img src={CS} alt='' />
          <h4>Violet</h4>
        </div>
        <div className='aa-helpCenter-desc-cs'>
          <img src={CS} alt='' />
          <h4>Aster</h4>
        </div>
      </div>
    )
  }
  return (
    <>
      <Header />
      <article className='aa-page-container'>
        <h1 className='aa-title'>Help center</h1>

        <Row gutter={20}>
          <Col span={8}>
            <div className='aa-helpCenter-card'>
              <h2>Customer training support</h2>
              <ul>
                <li>Account issues</li>
                <li>Course questions</li>
                <li>Operation questions</li>
              </ul>
              <Btn feature='action' onClick={() => history.push('/contactUs')}>
                Contact us
              </Btn>
              <p>
                Or find solutions in <Btn feature='link'>course</Btn>
              </p>
            </div>
          </Col>
          <Col span={16} className='aa-text-right'>
            {renderHelpCenterDesc()}
          </Col>
        </Row>
      </article>
      <Footer />
    </>
  )
}
export default HelpCenter

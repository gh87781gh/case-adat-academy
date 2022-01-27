import { Btn } from 'utility/component'
import { Row, Col } from 'antd'

const DemoPage = () => {
  return (
    <article style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '3rem', color: '#022061' }}>Demo Component</h1>

      <h2>Button</h2>
      <Row>
        <Col span={6}>
          <h3>filled</h3>
          <p>call to actions</p>
          <Btn feature='action'>Action button</Btn>
          <Btn feature='action' disabled={true}>
            Action button
          </Btn>
        </Col>
        <Col span={6}>
          <h3>outlined</h3>
          <p>primary</p>
          <Btn feature='primary'>Primary button</Btn>
          <Btn feature='primary' disabled={true}>
            Primary button
          </Btn>
        </Col>
        <Col span={6}>
          <h3>bordless</h3>
          <p>navigation / secondary </p>
          <Btn feature='secondary'>Secondary Btn</Btn>
          <Btn feature='secondary' disabled={true}>
            Secondary Btn
          </Btn>
        </Col>
        <Col span={6}>
          <h3>link</h3>
          <Btn feature='link'>Link Btn</Btn>
          <span
            style={{
              display: 'inline-block',
              backgroundColor: '#000',
              padding: '1px'
            }}
          >
            <Btn feature='link' className='ad-mode-dark'>
              Link Btn
            </Btn>
          </span>
          <br />
          <small>Link Btn has no disabled status</small>
        </Col>
      </Row>

      <hr />
    </article>
  )
}
export default DemoPage

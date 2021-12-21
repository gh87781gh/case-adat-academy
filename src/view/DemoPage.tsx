import Header from './layout/Header'
import Footer from './layout/Footer'
import { Btn } from 'utility/component'
import { Button, Row, Col, Select } from 'antd'
const { Option } = Select

const DemoPage = () => {
  return (
    <article style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '3rem', color: '#022061' }}>Demo Component</h1>

      <h2>Button</h2>
      <Row>
        <Col span={6}>
          <h3>filled</h3>
          <p>call to actions</p>
          <Btn type='action'>Action button</Btn>
          <Btn type='action' props={{ disabled: true }}>
            Action button
          </Btn>
        </Col>
        <Col span={6}>
          <h3>outlined</h3>
          <p>primary</p>
          <Btn type='primary'>Primary button</Btn>
          <Btn type='primary' props={{ disabled: true }}>
            Primary button
          </Btn>
        </Col>
        <Col span={6}>
          <h3>bordless</h3>
          <p>navigation / secondary </p>
          <Btn type='bordless'>Text Btn</Btn>
          <Btn type='bordless' props={{ disabled: true }}>
            Text Btn
          </Btn>
        </Col>
        <Col span={6}>
          <h3>link</h3>
          <Btn type='link'>Link Btn</Btn>
          <Btn type='link' props={{ disabled: true }}>
            Link Btn
          </Btn>
        </Col>
      </Row>

      <hr />
    </article>
  )
}
export default DemoPage

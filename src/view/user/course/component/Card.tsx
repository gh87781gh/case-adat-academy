import { IconTrash, IconArrowNext } from 'utility/icon'
import { Btn } from 'utility/component'
import { Row, Col } from 'antd'

interface IProps {
  type: string
  subtitle: string
  title: string
  text: string
}

const Card = (props: IProps) => {
  return (
    <div className='ad-card'>
      <Row gutter={20}>
        <Col span={20}>
          <h3>{props.subtitle}</h3>
          <h2>{props.title}</h2>
          <p>{props.text}</p>
        </Col>
        <Col span={4} style={{ height: 'unset' }}>
          <div className='ad-card-action'>
            <div className='ad-btn-group'>
              {props.type === 'BOOKMARK' ? (
                <Btn feature='secondary'>
                  <IconTrash />
                </Btn>
              ) : null}
              <Btn feature='secondary'>
                <IconArrowNext />
              </Btn>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}
export default Card

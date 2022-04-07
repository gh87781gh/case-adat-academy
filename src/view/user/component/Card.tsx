import { useHistory } from 'react-router-dom'

import { IconTrash, IconArrowNext } from 'utility/icon'
import { Btn } from 'utility/component'
import { Row, Col } from 'antd'

interface IProps {
  type: string
  subtitle: string
  title: string
  text: string
  course_id: string
  section_id: string
  cancelBookmark?: () => void
}

const Card = (props: IProps) => {
  const history = useHistory()

  return (
    <div className='aa-card'>
      <Row gutter={20}>
        <Col span={20}>
          <h3>{props.subtitle}</h3>
          <h2>{props.title}</h2>
          <p>{props.text}</p>
        </Col>
        <Col span={4} style={{ height: 'unset' }}>
          <div className='aa-card-action'>
            <div className='aa-btn-group'>
              {props.type === 'BOOKMARK' ? (
                <Btn feature='secondary' onClick={props.cancelBookmark}>
                  <IconTrash />
                </Btn>
              ) : null}
              <Btn
                feature='secondary'
                onClick={() =>
                  history.push(
                    `/courseDetail/${props.course_id}/${props.section_id}`
                  )
                }
              >
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

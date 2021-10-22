import { Row, Col, Button, Input, Modal } from 'antd'

interface IProps {
  isShow: boolean
  onCancel: () => void
}

const ModalAccount = (props: IProps) => {
  return (
    <Modal
      className='ad-modal-edit'
      title='Create account'
      visible={props.isShow}
      // onOk={handleOk}
      onCancel={props.onCancel}
      width={1100}
      footer={[
        <Button
          key='Create'
          type='primary'
          onClick={() => console.log('Create!')}
        >
          Create
        </Button>,
        <Button key='Cancel' onClick={props.onCancel}>
          Cancel
        </Button>
      ]}
    >
      <Row gutter={20}>
        <Col span={24}>
          <div className='ad-form-group'>
            <label>Purchase number</label>
            <div className='ad-form-group-value'>testyuiop</div>
          </div>
        </Col>
        <Col span={8}>
          <div className='ad-form-group'>
            <label>Company</label>
            <div className='ad-form-group-value'>Winbond</div>
          </div>
        </Col>
        <Col span={8}>
          <div className='ad-form-group'>
            <label>Status</label>
            <div className='ad-form-group-value'>Winbond</div>
          </div>
        </Col>
      </Row>
      <Row gutter={20}>
        <Col span={8}>
          <div className='ad-form-group'>
            <label>Course access</label>
            <div className='ad-form-group-value'>Winbond</div>
          </div>
        </Col>
        <Col span={8}>
          <div className='ad-form-group'>
            <label>Quota</label>
            <div className='ad-form-group-value'>2 used/ 5</div>
          </div>
        </Col>
        <Col span={8}>
          <div className='ad-form-group'>
            <label>Duration</label>
            <div className='ad-form-group-value'>2021/07/01-2022/06/01</div>
          </div>
        </Col>
        <Col span={10}>
          <div className='ad-form-group'>
            <label className='required'>Please input the account’s email</label>
            <Input
            // placeholder={Validation.input_placeholder}
            // maxLength={Validation.input_email_max}
            // value={data.user_id}
            // onChange={(e) => onChange('user_id', e)}
            />
          </div>
        </Col>
      </Row>
    </Modal>
  )
}
export default ModalAccount

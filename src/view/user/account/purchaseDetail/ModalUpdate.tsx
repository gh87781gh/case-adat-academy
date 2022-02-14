import { useState, useContext, useEffect } from 'react'
import { MyContext } from 'storage'
import AccountApi from 'api/user/AccountApi'
import { FormGroupMsg, Btn } from 'utility/component'
import { ValidateStr } from 'utility/validate'
import { formatDate } from 'utility/format'
import { Row, Col, Input, Select, Modal, Checkbox } from 'antd'
const { Option } = Select

interface IProps {
  isShow: boolean
  onCancel: () => void
}
interface IState {
  have_purchase_number: string
  email: string
  purchase_number: string
  password: string
}

const ModalUpdate = (props: IProps) => {
  const context = useContext(MyContext)
  const api = new AccountApi()

  const [data, setData] = useState<IState>({
    have_purchase_number: '',
    email: '',
    purchase_number: '',
    password: ''
  })
  const onChecks = (checkedValues: any) => {
    if (checkedValues.length > 1) checkedValues.shift()
    setData({ ...data, have_purchase_number: checkedValues[0] })
  }
  const onChange = (key: string, e: any) => {
    const value = e.target.value
    // if (value) {
    //   switch (key) {
    //     case 'email':
    //       if (value && !ValidateStr('isUserName', value)) return false
    //       setIsEmail(ValidateStr('isEmail', value))
    //       break
    //   }
    // }
    setData({ ...data, [key]: value })
  }

  useEffect(() => {
    if (props.isShow) {
      api
        .getUserEmail()
        .then((res: any) => {
          console.log(res) //TOCHECK
        })
        .finally(() => context.setIsLoading(false))
    }
  }, [props.isShow]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Modal
      className='ad-modal-user'
      visible={props.isShow}
      onCancel={props.onCancel}
      width={1100}
      footer={null}
    >
      <h1 className='ad-title'>Update course access</h1>
      <div className='ad-form-group'>
        <label className='required'>Do you have a purchase number?</label>
        <Checkbox.Group
          value={data.have_purchase_number ? [data.have_purchase_number] : []}
          className='ad-checkbox-btn-group'
          onChange={onChecks}
        >
          <Row gutter={[10, 10]}>
            <Col span={12} key={'Yes, I have.'}>
              <Checkbox className='ad-checkbox-btn' value={'true'}>
                Yes, I have.
              </Checkbox>
            </Col>
            <Col span={12} key={'No, I don’t.'}>
              <Checkbox className='ad-checkbox-btn' value={'false'}>
                No, I don’t.
              </Checkbox>
            </Col>
          </Row>
        </Checkbox.Group>
      </div>
      <Row gutter={20}>
        <Col span={12}>
          <div className='ad-form-group'>
            <label className='required'>New email</label>
            <Input
              placeholder='Please input'
              maxLength={50}
              value={data.email}
              onChange={(e) => onChange('email', e)}
            />
          </div>
        </Col>
        <Col span={12}>
          <div className='ad-form-group'>
            <label className='required'>New purchase number</label>
            <Input
              placeholder='Please input'
              maxLength={50}
              value={data.purchase_number}
              onChange={(e) => onChange('purchase_number', e)}
            />
          </div>
        </Col>
        <Col span={12}>
          <div className='ad-form-group'>
            <label className='required'>Password</label>
            <Input.Password
              placeholder='Clear hint for the input'
              maxLength={100}
              value={data.password}
              onChange={(e) => onChange('password', e)}
            />
          </div>
        </Col>
      </Row>
      <div className='ad-modal-user-footer'>
        <p>Please note that updating email requires re-login.</p>
        <div className='ad-btn-group'>
          <Btn
            // disabled={
            //   !data.name ||
            //   !data.industry ||
            //   !data.position ||
            //   !data.experience_level ||
            //   data.experience.length === 0
            // }
            feature='action'
            key='Submit'
            // onClick={() => update()}
          >
            Submit
          </Btn>
          <Btn
            feature='primary'
            key='Cancel'
            // onClick={() => submit()}
          >
            Cancel
          </Btn>
        </div>
      </div>
    </Modal>
  )
}
export default ModalUpdate

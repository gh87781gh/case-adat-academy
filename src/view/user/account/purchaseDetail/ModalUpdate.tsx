import { useState, useContext, useEffect } from 'react'
import { MyContext } from 'storage'
import GlobalApi from 'api/GlobalApi'
import AdminApi from 'api/admin/AdminApi'
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
  user_id: string
  password: string
  email: string
  role: string
}

const ModalUpdate = (props: IProps) => {
  const context = useContext(MyContext)
  const api_global = new GlobalApi()
  const api = new AdminApi()

  const onChecks = (checkedValues: any) => {
    // if (checkedValues.includes('Not sure')) {
    //   checkedValues.length >= 2 && checkedValues.indexOf('Not sure') === 0
    //     ? checkedValues.shift()
    //     : (checkedValues = ['Not sure'])
    // }
    // setData({ ...data, experience: checkedValues })
  }

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
          // value={data.experience}
          className='ad-checkbox-btn-group'
          onChange={onChecks}
        >
          <Row gutter={[10, 10]}>
            {/* <Col span={12} key={item}>
              <Checkbox className='ad-checkbox-btn' value={item}>
                {item}
              </Checkbox>
            </Col>
            <Col span={12} key={item}>
              <Checkbox className='ad-checkbox-btn' value={item}>
                {item}
              </Checkbox>
            </Col> */}
            {/* {experienceOption.map((item: string, index: number) => (
              <Col span={12} key={item}>
                <Checkbox className='ad-checkbox-btn' value={item}>
                  {item}
                </Checkbox>
              </Col>
            ))} */}
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
              // value={data.name}
              // onChange={(e) => onChange('name', e)}
            />
          </div>
        </Col>
        <Col span={12}>
          <div className='ad-form-group'>
            <label className='required'>New purchase number</label>
            <Input
              placeholder='Please input'
              maxLength={50}
              // value={data.name}
              // onChange={(e) => onChange('name', e)}
            />
          </div>
        </Col>
        <Col span={12}>
          <div className='ad-form-group'>
            <label className='required'>Password</label>
            <Input.Password
              placeholder='Clear hint for the input'
              maxLength={100}
              // value={data.password}
              // onChange={(e) => onChange('password', e)}
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

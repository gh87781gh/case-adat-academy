import { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { MyContext } from 'storage'
import AccountApi from 'api/user/AccountApi'

import schema from 'utility/validate'
import { Btn, FormGroupMsg } from 'utility/component'
import { Row, Col, Input, Modal, Checkbox } from 'antd'

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
  const history = useHistory()

  // data
  const initData = {
    have_purchase_number: 'true',
    email: '',
    purchase_number: '',
    password: ''
  }
  const [data, setData] = useState<IState>({ ...initData })
  const [isEmail, setIsEmail] = useState<boolean | undefined>(undefined)
  const onChange = (key: string, e: any) => {
    const value = e.target.value
    if (value) {
      switch (key) {
        case 'password':
        case 'purchase_number':
        case 'email':
          if (schema[key].validateStr(value)) return false
          break
      }
    }
    setData({ ...data, [key]: value })
  }
  const onChecks = (checkedValues: any) => {
    if (checkedValues.length > 1) checkedValues.shift()
    setData({ ...data, have_purchase_number: checkedValues[0] })
  }
  useEffect(() => {
    setIsEmail(data.email ? schema.email.validateFormat(data.email) : null)
  }, [data.email]) // eslint-disable-line react-hooks/exhaustive-deps

  // api
  const submit = () => {
    context.setIsLoading(true)
    api
      .updateUserEmail(data)
      .then(() => {
        props.onCancel()
        history.push('/login/successfully/updated')
      })
      .finally(() => context.setIsLoading(false))
  }

  useEffect(() => {
    // TODO
    if (props.isShow) {
      // api
      //   .getUserEmail()
      //   .then((res: any) => {
      //     // console.log(res)
      //   })
      //   .finally(() => context.setIsLoading(false))
    } else {
      setData({ ...initData })
    }
  }, [props.isShow]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Modal
      className='aa-modal-user'
      visible={props.isShow}
      onCancel={props.onCancel}
      width={1100}
      footer={null}
    >
      <h1 className='aa-title'>Update course access</h1>
      <div className='aa-form-group'>
        <label className='required'>Do you have a purchase number?</label>
        <Checkbox.Group
          value={data.have_purchase_number ? [data.have_purchase_number] : []}
          className='aa-checkbox-btn-group'
          onChange={onChecks}
        >
          <Row gutter={[10, 10]}>
            <Col span={12} key={'Yes, I have.'}>
              <Checkbox className='aa-checkbox-btn' value={'true'}>
                Yes, I have.
              </Checkbox>
            </Col>
            <Col span={12} key={'No, I don’t.'}>
              <Checkbox className='aa-checkbox-btn' value={'false'}>
                No, I don’t.
              </Checkbox>
            </Col>
          </Row>
        </Checkbox.Group>
      </div>
      <Row gutter={20}>
        <Col span={12}>
          <div className='aa-form-group'>
            <label className='required'>New email</label>
            <Input
              placeholder='Please input'
              maxLength={50}
              value={data.email}
              onChange={(e) => onChange('email', e)}
            />
            <FormGroupMsg
              isShow={isEmail === false}
              type='error'
              isShowIcon={true}
              msg={schema.email.errFormat}
            />
          </div>
        </Col>
        {data.have_purchase_number === 'true' ? (
          <Col span={12}>
            <div className='aa-form-group'>
              <label className='required'>New purchase number</label>
              <Input
                placeholder='Please input'
                maxLength={50}
                value={data.purchase_number}
                onChange={(e) => onChange('purchase_number', e)}
              />
            </div>
          </Col>
        ) : null}
        <Col span={12}>
          <div className='aa-form-group'>
            <label className='required'>
              Pleas enter your password for security purpose
            </label>
            <Input.Password
              placeholder='Clear hint for the input'
              maxLength={100}
              value={data.password}
              onChange={(e) => onChange('password', e)}
            />
          </div>
        </Col>
      </Row>
      <div className='aa-modal-user-footer'>
        <p>Please note that updating email requires re-login.</p>
        <div className='aa-btn-group'>
          <Btn
            disabled={
              !data.have_purchase_number ||
              !data.email ||
              (data.have_purchase_number === 'true' && !data.purchase_number) ||
              !data.password
            }
            feature='action'
            key='Submit'
            onClick={() => submit()}
          >
            Submit
          </Btn>
          <Btn feature='primary' key='Cancel' onClick={() => props.onCancel()}>
            Cancel
          </Btn>
        </div>
      </div>
    </Modal>
  )
}
export default ModalUpdate

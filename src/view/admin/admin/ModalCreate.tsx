import { useState, useContext, useEffect } from 'react'
import { MyContext } from 'storage'
import GlobalApi from 'api/GlobalApi'
import AdminApi from 'api/admin/AdminApi'

import schema from 'utility/validate'
import { FormGroupMsg, Btn } from 'utility/component'
import { Row, Col, Input, Select, Modal } from 'antd'
const { Option } = Select

interface IProps {
  isShow: boolean
  onCancel: () => void
  getList: (keepPage?: boolean) => void
  adminId?: string // if exist ->
}
interface IState {
  user_id: string
  password: string
  email: string
  role: string
}

const ModalCreate = (props: IProps) => {
  const context = useContext(MyContext)
  const api_global = new GlobalApi()
  const api = new AdminApi()

  const [isEmail, setIsEmail] = useState<boolean | undefined>(undefined)
  const initData = {
    user_id: '',
    password: '',
    email: '',
    role: ''
  }
  const [data, setData] = useState<IState>({ ...initData })
  const onSelect = (key: string, value: any) => {
    setData({ ...data, [key]: value })
  }
  const onChange = (key: string, e: any) => {
    const value = e.target.value
    if (value) {
      switch (key) {
        case 'user_id':
        case 'email':
          if (schema[key].validateStr(value)) return false
          break
        case 'password':
        case 'password2':
          if (schema.password.validateStr(value)) return false
          break
      }
    }
    setData({ ...data, [key]: value })
  }
  useEffect(() => {
    data.email
      ? setIsEmail(schema.email.validateFormat(data.email))
      : setIsEmail(undefined)
  }, [data.email]) // eslint-disable-line react-hooks/exhaustive-deps

  const [roleOption, setRoleOption] = useState<any>([])
  useEffect(() => {
    if (props.isShow) {
      setIsEmail(undefined)
      api_global
        .getOptions(['admin_management_roles'])
        .then((res: any) => {
          setRoleOption(res.data[0])
        })
        .finally(() => context.setIsLoading(false))

      if (props.adminId) {
        api
          .getAdminDetail(props.adminId)
          .then((res: any) => {
            const keys = Object.keys(data)
            const newData: any = {}
            for (const key of keys) {
              newData[key] = res.data[key]
            }
            setData(newData)
          })
          .finally(() => context.setIsLoading(false))
      } else {
        setData({ ...initData })
      }
    }
  }, [props.isShow]) // eslint-disable-line react-hooks/exhaustive-deps

  const submit = () => {
    context.setIsLoading(true)

    if (props.adminId) {
      api
        .editAdmin(props.adminId, data)
        .then(() => {
          props.getList(true)
          props.onCancel()
        })
        .finally(() => context.setIsLoading(false))
    } else {
      api
        .createAdmin(data)
        .then(() => {
          props.getList()
          props.onCancel()
        })
        .finally(() => context.setIsLoading(false))
    }
  }

  return (
    <Modal
      className='aa-modal-edit'
      title={props.adminId ? 'Edit admin' : 'Create admin'}
      visible={props.isShow}
      onCancel={props.onCancel}
      width={1100}
      footer={[
        <Btn
          feature='action'
          key='Create'
          disabled={
            props.adminId
              ? !data.role ||
                !data.user_id ||
                !data.email ||
                (data.password?.length > 0 && data.password?.length < 8) ||
                isEmail !== true
              : !data.role ||
                !data.user_id ||
                !data.email ||
                !data.password ||
                (data.password?.length > 0 && data.password?.length < 8) ||
                isEmail !== true
          }
          onClick={() => submit()}
        >
          {props.adminId ? 'Save' : 'Create'}
        </Btn>,
        <Btn feature='primary' key='Cancel' onClick={() => props.onCancel()}>
          Cancel
        </Btn>
      ]}
    >
      <Row gutter={20}>
        <Col span={12}>
          <div className='aa-form-group'>
            <label className='required'>Role</label>
            <Select
              value={data.role}
              placeholder='Please select'
              onChange={(val) => onSelect('role', val)}
            >
              {roleOption.map((item: string) => (
                <Option value={item} key={item}>
                  {item}
                </Option>
              ))}
            </Select>
          </div>
        </Col>
        <Col span={12}>
          <div className='aa-form-group'>
            <label className='required'>User ID</label>
            <Input
              value={data.user_id}
              maxLength={200}
              placeholder='Clear hint for the input'
              onChange={(e) => onChange('user_id', e)}
            />
          </div>
        </Col>
        <Col span={12}>
          <div className='aa-form-group'>
            <label className='required'>Email</label>
            <Input
              value={data.email}
              maxLength={200}
              placeholder='Clear hint for the input'
              onChange={(e) => onChange('email', e)}
            />
            <FormGroupMsg
              isShow={isEmail === false}
              type='error'
              msg='The Email format is not correct.'
            />
          </div>
        </Col>
        <Col span={12}>
          <div className='aa-form-group'>
            <label className=''>Password</label>
            <Input.Password
              placeholder='Clear hint for the input'
              maxLength={16}
              value={data.password}
              onChange={(e) => onChange('password', e)}
            />
            <FormGroupMsg
              isShow={data.password?.length > 0 && data.password?.length < 8}
              type='error'
              msg='Password is too short'
            />
          </div>
        </Col>
      </Row>
    </Modal>
  )
}
export default ModalCreate

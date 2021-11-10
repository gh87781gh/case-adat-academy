import { useState, useContext, useEffect } from 'react'
import { MyContext } from 'storage'
import GlobalApi from 'api/GlobalApi'
import CourseApi from 'api/admin/CourseApi'
import { IconUploadPic } from 'utility/icon'
import FormGroupMsg from 'utility/component/FormGroupMsg'
import { Row, Col, Button, Input, Modal } from 'antd'
const { TextArea } = Input

interface IProps {
  isShow: boolean
  onCancel: () => void
  getList: () => void
  adminId?: string
}
interface IState {
  name: string
  description: string
}

const ModalCreate = (props: IProps) => {
  const context = useContext(MyContext)
  const api_global = new GlobalApi()
  const api = new CourseApi()

  const [isEmail, setIsEmail] = useState<boolean | undefined>(undefined)
  const initData = {
    name: '',
    description: ''
  }
  const [data, setData] = useState<IState>({ ...initData })
  const onSelect = (key: string, value: any) => {
    setData({ ...data, [key]: value })
  }
  const onChange = (key: string, e: any) => {
    const value = e.target.value
    if (value) {
      switch (key) {
        case 'email':
          //   if (value && !ValidateStr('isUserName', value)) return false
          break
      }
    }
    setData({ ...data, [key]: value })
  }

  const [roleOption, setRoleOption] = useState<any>([])
  useEffect(() => {
    if (props.isShow) {
      // setIsEmail(undefined)
      // api_global
      //   .getOptions(['admin_roles'])
      //   .then((res: any) => {
      //     setRoleOption(res.data[0])
      //   })
      //   .finally(() => context.setIsLoading(false))
      // if (props.adminId) {
      //   api
      //     .getAdminDetail(props.adminId)
      //     .then((res: any) => setData(res.data))
      //     .finally(() => context.setIsLoading(false))
      // } else {
      //   setData({ ...initData })
      // }
    }
  }, [props.isShow]) // eslint-disable-line react-hooks/exhaustive-deps

  const submit = () => {
    context.setIsLoading(true)

    // if (props.adminId) {
    //   api
    //     .editAdmin(props.adminId, data)
    //     .then(() => {
    //       props.getList()
    //       props.onCancel()
    //     })
    //     .finally(() => context.setIsLoading(false))
    // } else {
    //   api
    //     .createAdmin(data)
    //     .then(() => {
    //       props.getList()
    //       props.onCancel()
    //     })
    //     .finally(() => context.setIsLoading(false))
    // }
  }

  return (
    <Modal
      title={
        props.adminId ? 'Edit course information' : 'Create course information'
      }
      visible={props.isShow}
      onCancel={props.onCancel}
      width={1100}
      footer={[
        <Button
          key='Create'
          type='primary'
          // disabled={
          //   !data.role ||
          //   !data.user_id ||
          //   !data.email ||
          //   (data.password?.length > 0 && data.password?.length < 8) ||
          //   isEmail !== true
          // }
          onClick={() => submit()}
        >
          Create
        </Button>,
        <Button key='Cancel' onClick={props.onCancel}>
          Cancel
        </Button>
      ]}
    >
      <Row gutter={20}>
        <Col span={6}>
          <div className='ad-upload-logo circle'>
            <span className='ad-upload-logo-watermark'>
              <IconUploadPic />
              <em>Upload logo</em>
            </span>
          </div>
          <small>
            Format should be.... <br />
            Recommand size is...
          </small>
        </Col>
        <Col span={9}>
          <div className='ad-form-group'>
            <label className='required'>Course name</label>
            <Input
              value={data.name}
              maxLength={200}
              placeholder='Clear hint for the input'
              onChange={(e) => onChange('name', e)}
            />
          </div>
          <div className='ad-form-group'>
            <label className='required'>Course description</label>
            <TextArea
              value={data.description}
              rows={4}
              placeholder='Clear hint for the input'
              onChange={(e) => onChange('description', e)}
            />
          </div>
        </Col>
        <Col span={9}>
          <div className='ad-form-group'>
            <label>Background image</label>
            <div className='ad-form-group-value'>
              <div className='ad-upload-logo'>
                <span className='ad-upload-logo-watermark'>
                  <IconUploadPic />
                  <em>Upload logo</em>
                </span>
              </div>
              <small>Format should be.... Recommand size is...</small>
            </div>
          </div>
        </Col>
      </Row>
    </Modal>
  )
}
export default ModalCreate

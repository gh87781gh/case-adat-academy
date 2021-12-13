import { useState, useContext, useEffect } from 'react'
import { MyContext } from 'storage'
import CourseApi from 'api/admin/CourseApi'
import GlobalApi from 'api/GlobalApi'
import { ValidateStr } from 'utility/validate'
import UploadImg from 'utility/component/UploadImg'
import { Row, Col, Button, Input, Modal } from 'antd'
const { TextArea } = Input

interface IProps {
  isShow: boolean
  onCancel: () => void
  getList: (keepPage?: boolean) => void
  courseId?: string
}
interface IState {
  name: string
  description: string
  logo_image_id: string
  background_image_id: string
}

const ModalCreate = (props: IProps) => {
  const context = useContext(MyContext)
  const api = new CourseApi()
  const api_global = new GlobalApi()

  const initData = {
    name: '',
    description: '',
    logo_image_id: '',
    background_image_id: ''
  }
  const [data, setData] = useState<IState>({ ...initData })
  const onChange = (key: string, e: any) => {
    const value = e.target.value
    if (value) {
      switch (key) {
        case 'name':
        case 'description':
          if (value && ValidateStr('isSymbol', value)) return false
          break
      }
    }
    setData({ ...data, [key]: value })
  }
  const onUpload = (key: string, value: string) => {
    setData({ ...data, [key]: value })
  }

  const submit = () => {
    context.setIsLoading(true)
    if (props.courseId) {
      api
        .editCourse(props.courseId, data)
        .then(() => {
          props.getList(true)
          props.onCancel()
        })
        .finally(() => context.setIsLoading(false))
    } else {
      api
        .createCourse(data)
        .then(() => {
          props.getList()
          props.onCancel()
        })
        .finally(() => context.setIsLoading(false))
    }
  }
  useEffect(() => {
    if (props.isShow) {
      if (props.courseId) {
        api
          .getCourseDetail(props.courseId)
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

  return (
    <Modal
      title={
        props.courseId ? 'Edit course information' : 'Create course information'
      }
      visible={props.isShow}
      onCancel={props.onCancel}
      width={1100}
      footer={[
        <Button
          key='Create'
          type='primary'
          disabled={!data.name || !data.description}
          onClick={() => submit()}
        >
          {props.courseId ? 'Save' : 'Create'}
        </Button>,
        <Button key='Cancel' onClick={props.onCancel}>
          Cancel
        </Button>
      ]}
    >
      <Row gutter={20}>
        <Col span={6}>
          <UploadImg
            type='circle'
            desc='Upload logo'
            system='temp'
            systemId=''
            imgId={data.logo_image_id}
            setUploadId={(id: string) => onUpload('logo_image_id', id)}
          />
          <p className='ad-upload-info'>
            Format should be .png, .jpg, .jpeg
            <br /> Recommend size 150px*150px (&lt; 5 MB)
          </p>
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
              <UploadImg
                type='rectangle'
                desc='Upload logo'
                system='temp'
                systemId=''
                imgId={data.background_image_id}
                setUploadId={(id: string) =>
                  onUpload('background_image_id', id)
                }
              />
              <p className='ad-upload-info'>
                Format should be .png, .jpg, .jpeg
                <br /> Recommend size 340px*200px (&lt; 5 MB)
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Modal>
  )
}
export default ModalCreate

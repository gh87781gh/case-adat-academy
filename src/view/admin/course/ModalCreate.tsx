import { useState, useContext, useEffect } from 'react'
import { MyContext, StaticService } from 'storage'
import CourseApi from 'api/admin/CourseApi'

import UploadImg from 'utility/component/UploadImg'

import schema from 'utility/validate'
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

  // data
  const initData = {
    name: '',
    description: '',
    logo_image_id: '',
    background_image_id: ''
  }
  const [data, setData] = useState<IState>({ ...initData })
  const onChange = (key: string, e: any) => {
    let value = e.target.value
    if (value) {
      switch (key) {
        case 'name':
          if (schema.course_name.validateStr(value)) return false
          break
        case 'description':
          if (schema[key].validateStr(value)) return false
          break
      }
    }
    setData({ ...data, [key]: value })
  }
  const onUpload = (key: string, value: string) => {
    setData({ ...data, [key]: value })
  }

  // api
  const create = () => {
    context.setIsLoading(true)
    api
      .createCourse(data)
      .then(() => {
        props.getList()
        props.onCancel()
      })
      .finally(() => context.setIsLoading(false))
  }
  const update = () => {
    if (props.courseId) {
      context.setIsLoading(true)
      api
        .editCourse(props.courseId, data)
        .then(() => {
          props.getList(true)
          props.onCancel()
        })
        .finally(() => context.setIsLoading(false))
    }
  }

  // init
  useEffect(() => {
    if (props.isShow && props.courseId) {
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
          onClick={() => (props.courseId ? update() : create())}
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
            theme='dark'
            type='circle'
            desc='Upload logo'
            system='course'
            systemId={props.courseId}
            imgId={data.logo_image_id}
            setUploadId={(id: string) => onUpload('logo_image_id', id)}
          />
          <p className='aa-upload-info'>
            Format should be .png, .jpg, .jpeg
            <br /> Recommend size 150px*150px (&lt; 5 MB)
          </p>
        </Col>
        <Col span={9}>
          <div className='aa-form-group'>
            <label className='required'>Course name</label>
            <Input
              value={data.name}
              maxLength={schema.course_name.max}
              placeholder={StaticService.placeholder.input}
              onChange={(e) => onChange('name', e)}
            />
          </div>
          <div className='aa-form-group'>
            <label className='required'>Course description</label>
            <TextArea
              value={data.description}
              maxLength={schema.description.max}
              rows={4}
              placeholder={StaticService.placeholder.input}
              onChange={(e) => onChange('description', e)}
            />
          </div>
        </Col>
        <Col span={9}>
          <div className='aa-form-group'>
            <label>Background image</label>
            <div className='aa-form-group-value'>
              <UploadImg
                theme='dark'
                type='rectangle'
                desc='Upload background image'
                system='course'
                systemId={props.courseId}
                imgId={data.background_image_id}
                setUploadId={(id: string) =>
                  onUpload('background_image_id', id)
                }
              />
              <p className='aa-upload-info'>
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

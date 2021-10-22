import { useState } from 'react'
import FormGroupMsg from '../../../utility/component/FormGroupMsg'
import { IconSearch } from '../../../utility/icon'
import {
  DatePicker,
  Row,
  Col,
  Button,
  Input,
  Select,
  Table,
  Tag,
  Modal
} from 'antd'
const { Option } = Select
const { RangePicker } = DatePicker
const { TextArea } = Input

interface IProps {
  mode: string // CREATE, UPDATE
  isShow: boolean
  onCancel: () => void
  data?: any
}
interface IState {}

const ModalEdit = (props: IProps) => {
  return (
    <Modal
      className='ad-modal-edit'
      title={
        props.mode === 'CREATE'
          ? 'Create purchase'
          : props.mode === 'UPDATE'
          ? 'Edit purchase'
          : ''
      }
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
            <label className='required'>Purchase number</label>
            <Input
            // placeholder={Validation.input_placeholder}
            // maxLength={Validation.input_email_max}
            // value={data.user_id}
            // onChange={(e) => onChange('user_id', e)}
            />
          </div>
        </Col>
        <Col span={12}>
          <div className='ad-form-group'>
            <label className='required'>Company</label>
            <Select
              // value={data.industry}
              placeholder='Please select'
              // onChange={(val) => onSelect('industry', val)}
            >
              <Option value={'test'}>test</Option>
              {/* {optionIndustry.map((item: any) => (
                  <Option value={item.value} key={item.value}>
                    {item.name}
                  </Option>
                ))} */}
            </Select>
          </div>
        </Col>
        <Col span={12}>
          <div className='ad-form-group'>
            <label className='required'>Duration</label>
            <RangePicker />
          </div>
        </Col>
        <Col span={12}>
          <div className='ad-form-group'>
            <label className='required'>Course access</label>
            <Select
              // value={data.industry}
              placeholder='Please select'
              // onChange={(val) => onSelect('industry', val)}
            >
              <Option value={'test'}>test</Option>
              {/* {optionIndustry.map((item: any) => (
                  <Option value={item.value} key={item.value}>
                    {item.name}
                  </Option>
                ))} */}
            </Select>
          </div>
        </Col>
        <Col span={12}>
          <div className='ad-form-group'>
            <label className='required'>Quota</label>
            <Input
            // placeholder={Validation.input_placeholder}
            // maxLength={Validation.input_email_max}
            // value={data.user_id}
            // onChange={(e) => onChange('user_id', e)}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className='ad-form-group'>
            <label className='required'>Remarks</label>
            <TextArea
              rows={4}
              // value={props.data.remarks}
              // onChange={(e) => onChange('desc', e)}
            />
          </div>
        </Col>
      </Row>
    </Modal>
  )
}
export default ModalEdit

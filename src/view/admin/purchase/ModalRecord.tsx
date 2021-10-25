import { useState, useEffect } from 'react'
import { Table, Modal } from 'antd'

interface IProps {
  isShow: boolean
  onCancel: () => void
}

const ModalRecord = (props: IProps) => {
  useEffect(() => {
    // TODO api
    setList([])
  }, [])

  const [list, setList] = useState([])
  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time'
    },
    {
      title: 'Editor',
      dataIndex: 'editor',
      key: 'editor'
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks'
    }
  ]

  return (
    <Modal
      zIndex={1001}
      className='ad-modal-info'
      title={
        <>
          Records
          <div className='ad-modal-title-sub'>
            <div className='ad-form-group ad-form-group-horizontal'>
              <label>purchase number</label>
              <div className='ad-form-group-value'>props.purchase_number</div>
            </div>
          </div>
        </>
      }
      visible={props.isShow}
      onCancel={props.onCancel}
      width={1100}
      footer={null}
    >
      <Table columns={columns} dataSource={list} />
    </Modal>
  )
}
export default ModalRecord

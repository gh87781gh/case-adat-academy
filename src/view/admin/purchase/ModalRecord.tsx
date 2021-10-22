import { useState, useEffect } from 'react'
import { Table, Modal } from 'antd'

interface IProps {
  isShow: boolean
  recordNumber: string
  onCancel: () => void
}

const ModalRecord = (props: IProps) => {
  useEffect(() => {
    setList([])
  }, [])

  const [list, setList] = useState([])
  const columns = [
    {
      title: 'Purchase number',
      dataIndex: 'number',
      key: 'number',
      render: (text: any) => <span>{text}</span>
    },
    {
      title: 'Company',
      dataIndex: 'Company',
      key: 'Company'
    },
    {
      title: 'Course access',
      dataIndex: 'access',
      key: 'access'
    },
    {
      title: 'Quota',
      dataIndex: 'Quota',
      key: 'Quota'
    },
    {
      title: 'Duration',
      dataIndex: 'Duration',
      key: 'Duration'
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status'
    },
    {
      title: 'Actions',
      key: 'Actions',
      dataIndex: 'Actions'
      // render: (tags: any) => (
      //   <>
      //     {tags.map((tag) => {
      //       let color = tag.length > 5 ? 'geekblue' : 'green'
      //       if (tag === 'loser') {
      //         color = 'volcano'
      //       }
      //       return (
      //         <Tag color={color} key={tag}>
      //           {tag.toUpperCase()}
      //         </Tag>
      //       )
      //     })}
      //   </>
      // )
    }
    // {
    //   title: 'Action',
    //   key: 'action'
    //   // render: (text, record) => (
    //   //   <Space size='middle'>
    //   //     <a>Invite {record.name}</a>
    //   //     <a>Delete</a>
    //   //   </Space>
    //   // )
    // }
  ]

  return (
    <Modal
      className='ad-modal-info'
      title={
        <>
          Records
          <div className='ad-modal-title-sub'>
            <div className='ad-form-group ad-form-group-horizontal'>
              <label> purchase number</label>
              <div className='ad-form-group-value'>testyuiop</div>
            </div>
          </div>
          {/* {props.recordNumber} */}
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

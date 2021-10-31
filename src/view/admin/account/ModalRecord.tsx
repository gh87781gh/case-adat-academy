import { useState, useEffect, useContext } from 'react'
import { MyContext } from '../../../storage'
import AccountApi from '../../../api/AccountApi'
import { Table, Modal } from 'antd'

interface IProps {
  isShow: boolean
  onCancel: () => void
  accountId: string
  userId: string
}

const ModalRecord = (props: IProps) => {
  const context = useContext(MyContext)
  const api = new AccountApi()

  const [list, setList] = useState([])

  const getList = () => {
    context.setIsLoading(true)
    api
      .getAccountRecord(props.accountId)
      .then((res: any) => {
        setList(res)
      })
      .catch()
      .finally(() => {
        context.setIsLoading(false)
      })
  }
  useEffect(() => {
    if (props.isShow) getList()
  }, [props.isShow]) // eslint-disable-line react-hooks/exhaustive-deps

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: 'Time',
      dataIndex: 'created_at',
      key: 'created_at'
    },
    {
      title: 'User ID',
      dataIndex: 'user_id',
      key: 'user_id'
    },
    {
      title: 'Purchase number',
      dataIndex: 'purchase_number',
      key: 'purchase_number',
      render: (text: any) => <>{text || '-'}</>
    },
    {
      title: 'Editor',
      dataIndex: 'editor',
      key: 'editor'
    },
    {
      title: 'Remarks',
      dataIndex: 'remark',
      key: 'remark'
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
              <label>User ID</label>
              <div className='ad-form-group-value'>{props.userId || '-'}</div>
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

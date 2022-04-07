import { useState, useEffect, useContext } from 'react'
import { MyContext, StaticService } from 'storage'
import AccountApi from 'api/admin/AccountApi'
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

  const [list, setList] = useState<any>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
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
      render: (text: any) => <>{text ?? '-'}</>
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
  const getList = (toPage?: number) => {
    const page = toPage ?? 1
    setPage(page)

    context.setIsLoading(true)
    api
      .getAccountRecord(props.accountId, page)
      .then((res: any) => {
        setList(res.data)
        setTotal(res.total)
      })
      .finally(() => context.setIsLoading(false))
  }
  useEffect(() => {
    if (props.isShow) getList()
  }, [props.isShow]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Modal
      zIndex={1001}
      className='aa-modal-info'
      title={
        <>
          Records
          <div className='aa-modal-title-sub'>
            <div className='aa-form-group aa-form-group-horizontal'>
              <label>User ID</label>
              <div className='aa-form-group-value'>{props.userId ?? '-'}</div>
            </div>
          </div>
        </>
      }
      visible={props.isShow}
      onCancel={props.onCancel}
      width={1100}
      footer={null}
    >
      <Table
        className='aa-admin-table'
        columns={columns}
        dataSource={list}
        pagination={{
          pageSize: StaticService.tablePageSize,
          current: page,
          total,
          onChange: (page: number) => getList(page)
        }}
      />
    </Modal>
  )
}
export default ModalRecord

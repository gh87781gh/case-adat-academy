import { useState, useEffect, useContext } from 'react'
import { MyContext, StaticService } from 'storage'
import PurchaseApi from 'api/admin/PurchaseApi'
import { Table, Modal } from 'antd'

interface IProps {
  isShow: boolean
  onCancel: () => void
  purchaseDetail: any
}

const ModalRecord = (props: IProps) => {
  const context = useContext(MyContext)
  const api = new PurchaseApi()

  const [list, setList] = useState([])
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
      .getPurchaseRecord(props.purchaseDetail.id, page)
      .then((res: any) => {
        setList(res.data)
        setTotal(res.total)
      })
      .finally(() => context.setIsLoading(false))
  }
  useEffect(() => {
    if (props.isShow && props.purchaseDetail.id) getList()
  }, [props.isShow]) // eslint-disable-line react-hooks/exhaustive-deps

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
              <div className='ad-form-group-value'>
                {props.purchaseDetail.purchase_number}
              </div>
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

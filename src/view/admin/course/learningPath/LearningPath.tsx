import { useState, useEffect, useContext } from 'react'
import { MyContext } from 'storage'
import CourseApi from 'api/admin/CourseApi'
import ModalLearnPath from './ModalLearnPath'
import { Button, Table, Breadcrumb } from 'antd'

interface IProps {
  prev: () => void
}

const LearningPath = (props: IProps) => {
  const context = useContext(MyContext)
  const api = new CourseApi()

  const [list, setList] = useState<any>([])
  const [learningGoal, setLearningGoal] = useState<string>('')
  const [isModalEditShow, setIsModalEditShow] = useState<boolean>(false)
  const columns = [
    {
      title: 'learning goal',
      dataIndex: 'goal',
      key: 'goal'
    },
    {
      title: 'Actions',
      key: 'action',
      dataIndex: 'action',
      render: (text: any, record: any) => (
        <div className='ad-btn-group'>
          <Button
            key='more'
            size='small'
            onClick={() => {
              setLearningGoal(record.goal)
              setIsModalEditShow(true)
            }}
          >
            Edit
          </Button>
        </div>
      )
    }
  ]
  const getList = () => {
    context.setIsLoading(true)
    api
      .getLearnGoals()
      .then((res: any) => setList(res.data))
      .finally(() => context.setIsLoading(false))
  }
  useEffect(() => {
    getList()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Breadcrumb separator='>'>
        <Breadcrumb.Item onClick={props.prev}>
          Course management
        </Breadcrumb.Item>
        <Breadcrumb.Item>learning path</Breadcrumb.Item>
      </Breadcrumb>
      <h1 className='ad-layout-admin-article-title'>Learning path</h1>
      <Table
        className='ad-admin-table'
        columns={columns}
        dataSource={list}
        pagination={false}
      />
      <ModalLearnPath
        isShow={isModalEditShow}
        onCancel={() => setIsModalEditShow(false)}
        getList={() => getList()}
        learningGoal={learningGoal}
      />
    </>
  )
}
export default LearningPath

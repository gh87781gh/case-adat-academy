import { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { MyContext } from 'storage'
import CourseApi from 'api/admin/CourseApi'

import Header from 'view/user/layout/Header'
import ModalLearnPath from './ModalLearnPath'
import AdminSideBar from 'view/admin/AdminSideBar'

import { Button, Table, Breadcrumb } from 'antd'

const LearningPath = () => {
  const context = useContext(MyContext)
  const api = new CourseApi()
  const history = useHistory()

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
      .getLearningPathGoals()
      .then((res: any) => setList(res.data))
      .finally(() => context.setIsLoading(false))
  }
  useEffect(() => {
    getList()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Header />
      <div className='ad-layout-admin'>
        <AdminSideBar />
        <article>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item onClick={() => history.push('/admin/course')}>
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
        </article>
      </div>
    </>
  )
}
export default LearningPath

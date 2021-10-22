import { useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import Header from '../layout/Header'
import Purchase from './purchase/Purchase'
import { MyContext } from '../../storage'
import GlobalApi from '../../api/GlobalApi'

import { Tabs } from 'antd'
const { TabPane } = Tabs

const Admin = () => {
  const context = useContext(MyContext)
  const api = new GlobalApi()
  const history = useHistory()

  useEffect(() => {
    context.setIsLoading(true)
    api
      .getAuth()
      .then((res: any) => {
        if (!res.is_admin) history.goBack()
        context.setAuth({ ...context.auth, user_id: res.user_id })
      })
      .catch(() => {
        // TODO 驗證身份失敗提示？
        history.push('/login')
      })
      .finally(() => {
        context.setIsLoading(false)
      })
  }, [])

  return (
    <>
      <Header />
      <Tabs className='ad-admin' tabPosition='left'>
        <TabPane tab='Purchase management' key='1'>
          <Purchase />
        </TabPane>
        <TabPane tab='Account management' key='2'>
          Account management
        </TabPane>
        <TabPane tab='Course management' key='3'>
          Course management
        </TabPane>
        <TabPane tab='Admin management' key='4'>
          Admin management
        </TabPane>
      </Tabs>
    </>
  )
}
export default Admin

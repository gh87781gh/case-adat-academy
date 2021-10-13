import Header from '../layout/Header'
import Purchase from './element/Purchase'

import { Tabs } from 'antd'
const { TabPane } = Tabs

const Admin = () => {
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

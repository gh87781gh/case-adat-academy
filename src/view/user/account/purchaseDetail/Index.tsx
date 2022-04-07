import { useState, useEffect, useContext } from 'react'
import { MyContext } from 'storage'
import AccountApi from 'api/user/AccountApi'

import Header from 'view/user/layout/Header'
import Footer from 'view/user/layout/Footer'
import AccountSideBar from '../AccountSideBar'
import ModalUpdate from './ModalUpdate'

import Empty from 'assets/img/empty.png'
import { Btn } from 'utility/component'
import { formatDate } from 'utility/format'
import { Row, Col } from 'antd'

interface IState {
  user_id: string
  status: string
  current_email: string
  purchase_number: string
  company: string
  purchase_status: string
  duration_start: string
  duration_end: string
  course_access: string
}

const Index = () => {
  const context = useContext(MyContext)
  const api = new AccountApi()

  const [data, setData] = useState<IState>({
    user_id: '',
    status: '',
    current_email: '',
    purchase_number: '',
    company: '',
    purchase_status: '',
    duration_start: '',
    duration_end: '',
    course_access: ''
  })
  const getUserPurchase = () => {
    context.setIsLoading(true)
    api
      .getUserPurchase()
      .then((res: any) => setData(res.data))
      .finally(() => context.setIsLoading(false))
  }
  useEffect(() => {
    getUserPurchase()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [isUpdateModalShow, setIsUpdateModalShow] = useState<boolean>(false)

  return (
    <>
      <Header />
      <div style={{ overflowX: 'hidden' }}>
        <Row gutter={20}>
          <Col span={5}>
            <AccountSideBar />
          </Col>
          <Col span={19}>
            <article className='aa-page-container aa-page-container-account'>
              <h1 className='aa-title'>
                Purchase details
                <Btn
                  feature='action'
                  className='aa-float-right'
                  onClick={() => setIsUpdateModalShow(true)}
                >
                  Update email
                </Btn>
              </h1>
              <Row gutter={20}>
                <Col span={6}>
                  <div className='aa-form-group aa-form-group-horizontal'>
                    <label style={{ minWidth: '90px' }}>Full name</label>
                    <div className='aa-form-group-value'>
                      <b>{data.user_id}</b>
                    </div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className='aa-form-group aa-form-group-horizontal'>
                    <label style={{ minWidth: '70px' }}>Status</label>
                    <div className='aa-form-group-value'>
                      <b>{data.status}</b>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className='aa-form-group aa-form-group-horizontal'>
                    <label style={{ minWidth: '120px' }}>Current email</label>
                    <div className='aa-form-group-value'>
                      <b>{data.current_email}</b>
                    </div>
                  </div>
                </Col>
              </Row>
              <div className='aa-layout-article-contentCard'>
                {data.purchase_number ? (
                  <Row gutter={20}>
                    <Col span={8}>
                      <div className='aa-form-group'>
                        <label>Purchase number</label>
                        <div className='aa-form-group-value'>
                          {data.purchase_number}
                        </div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className='aa-form-group'>
                        <label>Company</label>
                        <div className='aa-form-group-value'>
                          {data.company}
                        </div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className='aa-form-group'>
                        <label>Status</label>
                        <div className='aa-form-group-value'>
                          {data.purchase_status}
                        </div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className='aa-form-group'>
                        <label>Duration</label>
                        <div className='aa-form-group-value'>
                          {formatDate(data.duration_start)}-
                          {formatDate(data.duration_end)}
                        </div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className='aa-form-group'>
                        <label>Course access</label>
                        <div className='aa-form-group-value'>
                          {data.course_access}
                        </div>
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <div className='aa-layout-article-contentCard-empty'>
                    <img src={Empty} alt='' />
                    <p>No data</p>
                  </div>
                )}
              </div>
            </article>
          </Col>
        </Row>
      </div>
      <Footer />
      <ModalUpdate
        isShow={isUpdateModalShow}
        onCancel={() => setIsUpdateModalShow(false)}
        // getAccountDetail={() => getAccountDetail()}
      />
    </>
  )
}
export default Index

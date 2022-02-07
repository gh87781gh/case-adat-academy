import { useState, useEffect, useContext } from 'react'
import { MyContext, StaticService } from 'storage'
import { useHistory } from 'react-router-dom'
import GlobalApi from 'api/GlobalApi'
import AccountApi from 'api/user/AccountApi'

import Header from 'view/user/layout/Header'
import Footer from 'view/user/layout/Footer'
import AccountSideBar from '../AccountSideBar'
import ModalUpdate from './ModalUpdate'

import { Btn } from 'utility/component'
import CS from 'assets/img/temp-cs.jpeg'
import { Row, Col, Breadcrumb, Checkbox, Select, Input, message } from 'antd'
const { Option } = Select
const { TextArea } = Input

interface IState {
  name: string
  industry: string
  position: string
  current_company: string
  experience_level: string
  experience: string[]
  gender: string
  age_range: string
  location: string
  highest_degree: string
  university: string
  field_or_major: string
}

const Index = () => {
  const context = useContext(MyContext)
  const api_global = new GlobalApi()
  const api = new AccountApi()
  const history = useHistory()

  const [options, setOptions] = useState<any>([])
  useEffect(() => {
    context.setIsLoading(true)
    api_global
      .getOptions([
        'learning_profile_experiences',
        'learning_profile_experience_levels',
        'learning_profile_industries',
        'learning_profile_genders',
        'learning_profile_age_ranges',
        'learning_profile_highest_degrees'
      ])
      .then((res: any) => setOptions(res.data))
      .finally(() => context.setIsLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [data, setData] = useState<IState>({
    name: '',
    gender: '',
    age_range: '',
    location: '',
    industry: '',
    position: '',
    experience_level: '',
    current_company: '',
    experience: [],
    highest_degree: '',
    university: '',
    field_or_major: ''
  })
  const getLearningProfile = () => {
    context.setIsLoading(true)
    api
      .getLearningProfile()
      .then((res: any) => setData(res.data))
      .finally(() => context.setIsLoading(false))
  }
  useEffect(() => {
    getLearningProfile()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [isUpdateModalShow, setIsUpdateModalShow] = useState<boolean>(true) //TODO

  return (
    <>
      <Header />
      <div style={{ overflowX: 'hidden' }}>
        <Row gutter={20}>
          <Col span={5}>
            <AccountSideBar />
          </Col>
          <Col span={19}>
            <article className='ad-page-container ad-page-container-account'>
              <h1 className='ad-title'>
                Purchase details
                <Btn
                  feature='action'
                  className='ad-float-right'
                  onClick={() => setIsUpdateModalShow(true)}
                >
                  Update email
                </Btn>
              </h1>

              <Row gutter={20}>
                <Col span={6}>
                  <div className='ad-form-group ad-form-group-horizontal'>
                    <label style={{ minWidth: '90px' }}>Full name</label>
                    <div className='ad-form-group-value'>
                      <b>sdfghj</b>
                    </div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className='ad-form-group ad-form-group-horizontal'>
                    <label style={{ minWidth: '70px' }}>Status</label>
                    <div className='ad-form-group-value'>
                      <b>sdfghj</b>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className='ad-form-group ad-form-group-horizontal'>
                    <label style={{ minWidth: '120px' }}>Current email</label>
                    <div className='ad-form-group-value'>
                      <b>sdfghj</b>
                    </div>
                  </div>
                </Col>
              </Row>
              <div className='ad-layout-article-contentCard'>
                <Row gutter={20}>
                  <Col span={8}>
                    <div className='ad-form-group'>
                      <label>Purchase number</label>
                      <div className='ad-form-group-value'>sdfghj</div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className='ad-form-group'>
                      <label>Company</label>
                      <div className='ad-form-group-value'>sdfghj</div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className='ad-form-group'>
                      <label>Status</label>
                      <div className='ad-form-group-value'>sdfghj</div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className='ad-form-group'>
                      <label>Duration</label>
                      <div className='ad-form-group-value'>sdfghj</div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className='ad-form-group'>
                      <label>Course access</label>
                      <div className='ad-form-group-value'>sdfghj</div>
                    </div>
                  </Col>
                </Row>
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

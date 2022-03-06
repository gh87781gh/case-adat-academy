import { useState, useEffect, useContext } from 'react'
import { MyContext, StaticService } from 'storage'
import { useHistory } from 'react-router-dom'
import AccountApi from 'api/user/AccountApi'

import Header from 'view/user/layout/Header'
import Footer from 'view/user/layout/Footer'
import AccountSideBar from '../AccountSideBar'

import schema from 'utility/validate'
import { Btn, FormGroupMsg } from 'utility/component'
import { Row, Col, Input } from 'antd'

interface IState {
  password: string
  change_password: string
  change_password2: string
}

const Index = () => {
  const context = useContext(MyContext)
  const api = new AccountApi()
  const history = useHistory()

  const [data, setData] = useState<IState>({
    password: '',
    change_password: '',
    change_password2: ''
  })
  const [isPassword2Correct, setIsPassword2Correct] = useState<boolean | null>(
    null
  )
  const onChange = (key: string, e: any) => {
    let value = e.target.value
    if (value) {
      switch (key) {
        case 'password':
        case 'change_password':
        case 'change_password2':
          if (schema.password.validateStr(value)) return false
          break
      }
    }
    setData({ ...data, [key]: value })
  }
  useEffect(() => {
    setIsPassword2Correct(data.change_password === data.change_password2)
  }, [data.change_password2]) // eslint-disable-line react-hooks/exhaustive-deps

  const changePassword = () => {
    context.setIsLoading(true)
    api
      .changePassword(data)
      .then(() => history.push('/login/successfully/updated'))
      .finally(() => context.setIsLoading(false))
  }

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
              <h1 className='ad-title'>Change password</h1>
              <div style={{ maxWidth: '500px' }}>
                <div className='ad-form-group'>
                  <label className='required'>Current password</label>
                  <Input.Password
                    placeholder={StaticService.placeholder.password}
                    minLength={schema.password.min}
                    maxLength={schema.password.max}
                    value={data.password}
                    onChange={(e: any) => onChange('password', e)}
                  />
                  <FormGroupMsg
                    isShow={
                      data.password.length > 0 && data.password.length < 8
                    }
                    type='error'
                    isShowIcon={true}
                    msg={schema.password.errTooShort}
                  />
                </div>
                <div className='ad-form-group'>
                  <label className='required'>New password</label>
                  <Input.Password
                    placeholder={StaticService.placeholder.password}
                    minLength={schema.password.min}
                    maxLength={schema.password.max}
                    value={data.change_password}
                    onChange={(e: any) => onChange('change_password', e)}
                  />
                  <FormGroupMsg
                    isShow={
                      data.change_password.length > 0 &&
                      data.change_password.length < 8
                    }
                    type='error'
                    isShowIcon={true}
                    msg={schema.password.errTooShort}
                  />
                </div>
                <div className='ad-form-group'>
                  <label className='required'>New password again</label>
                  <Input.Password
                    placeholder={StaticService.placeholder.password}
                    minLength={schema.password.min}
                    maxLength={schema.password.max}
                    value={data.change_password2}
                    onChange={(e: any) => onChange('change_password2', e)}
                  />
                  <FormGroupMsg
                    isShow={
                      data.change_password2 &&
                      data.change_password !== data.change_password2
                    }
                    type='error'
                    isShowIcon={true}
                    msg={schema.password.errNotMatch}
                  />
                </div>
                <div className='ad-modal-user-footer'>
                  <p>Please note that changing password requires re-login.</p>
                  <div className='ad-btn-group'>
                    <Btn
                      disabled={
                        !data.password ||
                        !data.change_password ||
                        data.password === data.change_password ||
                        !data.change_password2 ||
                        isPassword2Correct === false
                      }
                      feature='action'
                      block
                      key='Save'
                      onClick={() => changePassword()}
                    >
                      Save
                    </Btn>
                  </div>
                </div>
              </div>
            </article>
          </Col>
        </Row>
      </div>
      <Footer />
    </>
  )
}
export default Index

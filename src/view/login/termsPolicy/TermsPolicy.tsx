import { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { StaticService } from 'storage'

import LoginTemplate from '../LoginTemplate'

import { Btn, FormGroupMsg } from 'utility/component'
import { ValidateStr } from 'utility/validate'
import { IconArrowPrev } from 'utility/icon'
import { Row, Col, Input, Checkbox, Select } from 'antd'
const { Option } = Select

const TermsPolicy = () => {
  const history = useHistory()

  return (
    <LoginTemplate>
      <Btn
        style={{ marginBottom: '16px' }}
        feature='secondary'
        onClick={() => history.push('/login')}
      >
        <IconArrowPrev />
        Back
      </Btn>
      <div className='ad-login-content-header'>Contact us</div>
      <div
        className='ad-login-content-body ad-login-content-body-termsPolicy'
        style={{ maxHeight: '500px', overflowY: 'auto' }}
      >
        <b>Collecting and Using Your Personal Data</b>
        <h3>Types of Data Collected</h3>
        <h4>Personal Data</h4>
        <p>
          While using Our Service, We may ask You to provide Us with certain
          personally identifiable information that can be used to contact or
          identify You. Personally identifiable information may include, but is
          not limited to:
          <ul>
            <li>Email address </li>
            <li>First name and last name </li>
            <li>Phone number</li>
            <li> Address, State, Province, ZIP/Postal code, City</li>
          </ul>
        </p>

        <h4>Tracking Technologies and Cookies</h4>
        {/* TODO 請提供word檔 */}
        <p>
          <ul>
            <li></li>
          </ul>
        </p>
      </div>
    </LoginTemplate>
  )
}
export default TermsPolicy

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
      <div className='ad-login-content-header'>Terms & policy</div>
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
        <h4>Usage Data</h4>
        <p>
          Usage Data is collected automatically when using the Service. Usage
          Data may include information such as Your Device's Internet Protocol
          address (e.g. IP address), browser type, browser version, the pages of
          our Service that You visit, the time and date of Your visit, the time
          spent on those pages, unique device identifiers and other diagnostic
          data. When You access the Service by or through a mobile device, We
          may collect certain information automatically, including, but not
          limited to, the type of mobile device You use, Your mobile device
          unique ID, the IP address of Your mobile device, Your mobile operating
          system, the type of mobile Internet browser You use, unique device
          identifiers and other diagnostic data. We may also collect information
          that Your browser sends whenever You visit our Service or when You
          access the Service by or through a mobile device.
        </p>
        <h4>Tracking Technologies and Cookies</h4>
        <p>
          We use Cookies and similar tracking technologies to track the activity
          on Our Service and store certain information. Tracking technologies
          used are beacons, tags, and scripts to collect and track information
          and to improve and analyze Our Service. The technologies We use may
          include: Cookies or Browser Cookies. A cookie is a small file placed
          on Your Device. You can instruct Your browser to refuse all Cookies or
          to indicate when a Cookie is being sent. However, if You do not accept
          Cookies, You may not be able to use some parts of our Service. Unless
          you have adjusted Your browser setting so that it will refuse Cookies,
          our Service may use Cookies. "Where can I change the settings for
          disabling, or deleting local shared objects?" available at:
          <ul>
            <li>Cookie Settings for Chrome™</li>
            <li>Cookie Settings for Firefox®</li>
            <li>Cookie settings for Internet Explorer®</li>
            <li>Cookie Settings for Safari®</li>
          </ul>
        </p>

        <h3>Use of Your Personal Data</h3>
        <p>
          The Company may use Personal Data for the following purposes:
          <ul>
            <li>
              To provide and maintain our Service, including to monitor the
              usage of our Service. To manage Your Account: to manage Your
              registration as a user of the Service.
            </li>
            <li>
              To manage Your Account: to manage Your registration as a user of
              the Service. The Personal Data You provide can give You access to
              different functionalities of the Service that are available to You
              as a registered user.
            </li>
            <li>
              For the performance of a contract: the development, compliance and
              undertaking of the purchase contract for the products, items or
              services You have purchased or of any other contract with Us
              through the Service.
            </li>
            <li>
              To contact You: To contact You by email, telephone calls, SMS, or
              other equivalent forms of electronic communication, such as a
              mobile application's push notifications regarding updates or
              informative communications related to the functionalities,
              products or contracted services, including the security updates,
              when necessary or reasonable for their implementation.
            </li>
            <li>
              To provide You with news, special offers and general information
              about other goods, services and events which we offer that are
              similar to those that you have already purchased or enquired about
              unless You have opted not to receive such information.
            </li>
            <li>
              To manage Your requests: To attend and manage Your requests to Us.
            </li>
            <li>
              For other purposes: We may use Your information for other
              purposes, such as data analysis, identifying usage trends,
              determining the effectiveness of our promotional campaigns and to
              evaluate and improve our Service, products, services, marketing
              and your experience.
            </li>
          </ul>
        </p>

        <h3>Retention of Your Personal Data</h3>
        <p>
          The Company will retain Your Personal Data only for as long as is
          necessary for the purposes set out in this Privacy Policy. We will
          retain and use Your Personal Data to the extent necessary to comply
          with our legal obligations (for example, if we are required to retain
          your data to comply with applicable laws), resolve disputes, and
          enforce our legal agreements and policies.
          <br />
          The Company will also retain Usage Data for internal analysis
          purposes. Usage Data is generally retained for a shorter period of
          time, except when this data is used to strengthen the security or to
          improve the functionality of Our Service, or We are legally obligated
          to retain this data for longer time periods.
        </p>

        <h3>Disclosure of Your Personal Data</h3>
        <h4>Law enforcement</h4>
        <p>
          The Company may disclose Your Personal Data in the good faith belief
          that such action is necessary to:
          <ul>
            <li>Comply with a legal obligation</li>
            <li>Protect and defend the rights or property of the Company</li>
            <li>
              Prevent or investigate possible wrongdoing in connection with the
              Service
            </li>
            <li>
              Protect the personal safety of Users of the Service or the public
            </li>
            <li>Protect against legal liability</li>
          </ul>
        </p>

        <h3>Security of Your Personal Data</h3>
        <p>
          The security of Your Personal Data is important to Us, but remember
          that no method of transmission over the Internet, or method of
          electronic storage is 100% secure. While We strive to use commercially
          acceptable means to protect Your Personal Data, We cannot guarantee
          its absolute security.
        </p>

        <b>Changes to this Privacy Policy</b>
        <p>
          We may update Our Privacy Policy from time to time. We will notify You
          of any changes by posting the new Privacy Policy on this page.
          <br />
          We will let You know on Our Service, prior to the change becoming
          effective and update the "Last updated" date at the top of this
          Privacy Policy. <br />
          You are advised to review this Privacy Policy periodically for any
          changes. <br />
          Changes to this Privacy Policy are effective when they are posted on
          this page.
        </p>
      </div>
    </LoginTemplate>
  )
}
export default TermsPolicy

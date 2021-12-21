import Header from '../layout/Header'
import Footer from '../layout/Footer'
import {
  IconPathEmpty,
  IconPathCheck,
  IconPathInProgress,
  IconPathLine,
  IconPathArrow,
  IconArrowDown,
  IconBookmark
} from 'utility/icon'
import { Btn } from 'utility/component'
import { Button, Row, Col, Select } from 'antd'
const { Option } = Select

const User = () => {
  return (
    <>
      <Header />
      <div className='ad-banner-course'>
        <div className='ad-layout-container'>
          <p className='ad-banner-course-desc'>
            Based on your <Btn type='link'>learning profile</Btn>, we recommend
            this
          </p>
          <h1 className='ad-banner-course-title'>
            <span>LEARNING</span> <span>PATH</span>
          </h1>
          <div className='ad-banner-course-path'>
            <div className='ad-banner-course-path-stage'>
              <p>stage 1</p>
              <div className='ad-banner-course-path-group'>
                <div className='ad-banner-course-path-class'>
                  <div className='ad-banner-course-path-status'>
                    <IconPathCheck /> <IconPathLine />
                  </div>
                  <span>System architecture</span>
                </div>
              </div>
            </div>
            <IconPathArrow className='ad-banner-course-path-arrow' />
            <div className='ad-banner-course-path-stage'>
              <p>stage 2</p>
              <div className='ad-banner-course-path-group'>
                <div className='ad-banner-course-path-class'>
                  <div className='ad-banner-course-path-status'>
                    <IconPathCheck /> <IconPathLine />
                  </div>
                  <span>System architecture</span>
                </div>
                <div className='ad-banner-course-path-class'>
                  <div className='ad-banner-course-path-status'>
                    <IconPathInProgress /> <IconPathLine />
                  </div>
                  <span>System architecture</span>
                </div>
              </div>
            </div>
            <IconPathArrow className='ad-banner-course-path-arrow' />
            <div className='ad-banner-course-path-stage'>
              <p>stage 3</p>
              <div className='ad-banner-course-path-group'>
                <div className='ad-banner-course-path-class'>
                  <div className='ad-banner-course-path-status'>
                    <IconPathEmpty /> <IconPathLine />
                  </div>
                  <span>System architecture</span>
                </div>
                <div className='ad-banner-course-path-class'>
                  <div className='ad-banner-course-path-status'>
                    <IconPathEmpty /> <IconPathLine />
                  </div>
                  <span>System architecture</span>
                </div>
                <div className='ad-banner-course-path-class'>
                  <div className='ad-banner-course-path-status'>
                    <IconPathEmpty /> <IconPathLine />
                  </div>
                  <span>System architecture</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <article className='ad-layout-article ad-layout-container'>
        <Row>
          <Col span={20}>
            <div className='ad-clearfix'>
              <div className='ad-form-group ad-form-group-horizontal ad-float-right'>
                <label>
                  {/* Icon bookmark */}
                  <b>Show</b>
                </label>
                <Select
                  style={{ width: '300px' }}
                  // open={true}
                  // value={data.industry}
                  placeholder='Please select'
                  // suffixIcon={<IconArrowDown />}
                  // onChange={(val) => onSelect('industry', val)}
                >
                  <Option value='option1' key='option1'>
                    option1
                  </Option>
                  <Option value='option2' key='option2'>
                    option2
                  </Option>
                  <Option value='option3' key='option3'>
                    option3
                  </Option>
                  {/* {list.map((item: any) => (
                <Option value={item.value} key={item.value}>
                  {item.name}
                </Option>
              ))} */}
                </Select>
              </div>
            </div>
          </Col>
          <Col span={4} className='ad-clearfix'>
            <Button type='text' className='ad-float-right'>
              {/* <IconBookmark /> */}
              Bookmark
            </Button>
          </Col>
        </Row>
        <ul className='ad-card-group'>
          <li className='ad-card'>
            <div className='ad-card-img'>
              {/* <img src='../../utility/' alt='' /> logo pic */}
            </div>
            <div className='ad-card-content'>
              <h2>SYSTEM ARCHITECTURE</h2>
              <p>
                Some DescriptionSome DescriptionSome DescriptionSome Some
                DescriptionSome DescriptionSome DescriptionSome
              </p>
            </div>
            <div className='ad-card-action'>
              <Button
              //  onClick={() => history.push('/Course')}
              >
                Take class
              </Button>
              <small>
                <span>3 DAYS AGO</span> LAST READ
              </small>
            </div>
          </li>
          <li className='ad-card'>
            <div className='ad-card-img'>{/* <LogoAIR /> */}</div>
            <div className='ad-card-content'>
              <h2>SYSTEM ARCHITECTURE</h2>
              <p>
                Some DescriptionSome DescriptionSome DescriptionSome Some
                DescriptionSome DescriptionSome DescriptionSome
              </p>
            </div>
            <div className='ad-card-action'>
              <Button>Take class</Button>
              <small>
                <span>3 DAYS AGO</span> LAST READ
              </small>
            </div>
          </li>
          <li className='ad-card'>
            <div className='ad-card-img'>{/* <LogoAIR /> */}</div>
            <div className='ad-card-content'>
              <h2>SYSTEM ARCHITECTURE</h2>
              <p>
                Some DescriptionSome DescriptionSome DescriptionSome Some
                DescriptionSome DescriptionSome DescriptionSome
              </p>
            </div>
            <div className='ad-card-action'>
              <Button>Take class</Button>
              <small>
                <span>3 DAYS AGO</span> LAST READ
              </small>
            </div>
          </li>
        </ul>
      </article>
      <Footer />
    </>
  )
}
export default User

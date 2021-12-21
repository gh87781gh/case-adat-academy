import Header from 'view/layout/Header'
import Footer from 'view/layout/Footer'
import { IconArrowDown, IconBookmark } from 'utility/icon'
import { Btn } from 'utility/component'
import LearningPath from './LearningPath'

import { Button, Row, Col, Select } from 'antd'
const { Option } = Select

const Index = () => {
  return (
    <>
      <Header />
      <div className='ad-course-banner'>
        <div className='container'>
          <p className='desc'>
            Based on your <Btn type='link'>learning profile</Btn>, we recommend
            this
          </p>
          <h1 className='title'>
            <span>LEARNING</span> <span>PATH</span>
          </h1>
          <LearningPath />
        </div>
      </div>
      <article>
        <section className='ad-section ad-section-course'>
          <Row>
            <Col span={20}>
              <div className='ad-clearfix'>
                <div className='ad-form-group ad-form-group-horizontal ad-float-right'>
                  <label>
                    <b>Show</b>
                  </label>
                  <Select
                    style={{ width: '300px' }}
                    // open={true}
                    // value={data.industry}
                    placeholder='Please select'
                    suffixIcon={<IconArrowDown />}
                    // onChange={(val) => onSelect('industry', val)}
                  >
                    {/* TODO get list from api */}
                    <Option value='option1' key='option1'>
                      Based on learning path
                    </Option>
                    <Option value='option2' key='option2'>
                      All available course
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
            <Col span={4} style={{ textAlign: 'right' }}>
              <Btn type='bordless'>
                <IconBookmark />
                Bookmark
              </Btn>
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
        </section>
      </article>
      <Footer />
    </>
  )
}
export default Index

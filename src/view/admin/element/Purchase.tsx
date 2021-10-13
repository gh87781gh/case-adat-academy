import { IconSearch, IconArrowDown } from '../../../utility/icon'
import {
  Row,
  Col,
  Button,
  Input,
  Checkbox,
  Select,
  Table,
  Tag,
  Space
} from 'antd'
const { Option } = Select

const Purchase = () => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: any) => <a>{text}</a>
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age'
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags'
      // render: (tags: any) => (
      //   <>
      //     {tags.map((tag) => {
      //       let color = tag.length > 5 ? 'geekblue' : 'green'
      //       if (tag === 'loser') {
      //         color = 'volcano'
      //       }
      //       return (
      //         <Tag color={color} key={tag}>
      //           {tag.toUpperCase()}
      //         </Tag>
      //       )
      //     })}
      //   </>
      // )
    },
    {
      title: 'Action',
      key: 'action'
      // render: (text, record) => (
      //   <Space size='middle'>
      //     <a>Invite {record.name}</a>
      //     <a>Delete</a>
      //   </Space>
      // )
    }
  ]

  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer']
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser']
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher']
    }
  ]

  return (
    <>
      <h1 className='ad-article-title'>
        Purchase management
        <Button
          className='ad-float-right'
          type='primary'
          // onClick={() => history.push('/login/contact')}
        >
          Create purchase
        </Button>
      </h1>
      <div className=''>
        <div className='ad-form-group'>
          <label className='required'>Company</label>
          <Select
            // value={data.industry}
            placeholder='Please select'
            // onChange={(val) => onSelect('industry', val)}
          >
            <Option value={'test'}>test</Option>
            {/* {optionIndustry.map((item: any) => (
                  <Option value={item.value} key={item.value}>
                    {item.name}
                  </Option>
                ))} */}
          </Select>
        </div>
        <div className='ad-form-group'>
          <label className='required'>Company</label>
          <Select
            // value={data.industry}
            placeholder='Please select'
            // onChange={(val) => onSelect('industry', val)}
          >
            <Option value={'test'}>test</Option>
            {/* {optionIndustry.map((item: any) => (
                  <Option value={item.value} key={item.value}>
                    {item.name}
                  </Option>
                ))} */}
          </Select>
        </div>
        <div className='ad-header-searchBar'>
          <Input placeholder='Search course content' />
          <Button type='primary' icon={<IconSearch />} />
        </div>
      </div>
      <Table columns={columns} dataSource={data} />
    </>
  )
}
export default Purchase

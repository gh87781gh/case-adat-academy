import { Select } from 'antd'
export const { Option } = Select
export const CustomSelect = (props: any) => {
  return (
    <Select placeholder='Please select' {...props}>
      {props.Children}
    </Select>
  )
}

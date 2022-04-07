import { useContext, useRef, useEffect } from 'react'
import { MyContext, StaticService } from 'storage'
import GlobalApi from 'api/GlobalApi'

import { Btn } from 'utility/component'
import { IconImg } from 'utility/icon'
import { message } from 'antd'

interface IProps {
  theme?: string
  type: string
  desc: string
  system: string
  systemId: string | undefined
  imgId: string
  setUploadId: (id: string) => void
  replaceCount?: number
}

const UploadImg = (props: IProps) => {
  const context = useContext(MyContext)
  const api = new GlobalApi()
  const inputEl = useRef<HTMLInputElement>(null)

  const upload = (event: any) => {
    if (
      event.target.files[0] &&
      event.target.files[0].size > StaticService.uploadImgMaxSize
    ) {
      message.error('The file size exceeds 5mb. Please use another one.')
    } else {
      context.setIsLoading(true)
      api
        .uploadImg(event.target.files[0], props.system, props.systemId)
        .then((res: any) => {
          props.setUploadId(res.data.id)
          event.target.value = ''
        })
        .finally(() => context.setIsLoading(false))
    }
  }

  useEffect(() => {
    if (props.replaceCount !== undefined && props.replaceCount > 0) {
      inputEl.current?.click()
    }
  }, [props.replaceCount]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`aa-upload ${props.type} ${props.theme || ''}`}>
      <label>
        {props.imgId ? (
          <img
            className='aa-upload-uploaded'
            src={`${StaticService.apiUrl}/archive/${props.imgId}`}
            alt=''
          />
        ) : (
          <span className='aa-upload-watermark'>
            <IconImg />
            <em>{props.desc}</em>
          </span>
        )}
        <input
          ref={inputEl}
          style={{ display: 'none' }}
          type='file'
          accept='.png,.jpg,.jpeg,.bmp'
          multiple={false}
          onChange={upload}
        />
      </label>
      {props.imgId ? (
        <div className='aa-btn-group'>
          <Btn feature='link' onClick={() => inputEl.current?.click()}>
            Replace
          </Btn>
          <Btn feature='link' onClick={() => props.setUploadId('')}>
            Remove
          </Btn>
        </div>
      ) : null}
    </div>
  )
}
export default UploadImg

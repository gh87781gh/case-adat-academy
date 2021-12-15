import { useContext, useRef, useEffect } from 'react'
import { MyContext, StaticService } from 'storage'
import { IconUploadPic } from 'utility/icon'
import GlobalApi from 'api/GlobalApi'
import { Button } from 'antd'

interface IProps {
  type: string
  desc: string
  system: string
  systemId: string
  imgId: string
  setUploadId: (id: string) => void
  replaceCount?: number
}

const UploadImg = (props: IProps) => {
  const context = useContext(MyContext)
  const api = new GlobalApi()
  const inputEl = useRef<HTMLInputElement>(null)

  const upload = (event: any) => {
    // console.log('event.target.files[0]:', event.target.files[0])
    if (event.target.files[0]) {
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
    <div className={`ad-upload ${props.type}`}>
      <label>
        {props.imgId ? (
          <img
            className='ad-upload-uploaded'
            src={`${StaticService.apiUrl}/archive/${props.imgId}`}
            alt=''
          />
        ) : (
          <span className='ad-upload-watermark'>
            <IconUploadPic />
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
        <div className='ad-btn-group'>
          <Button type='link' onClick={() => inputEl.current?.click()}>
            Replace
          </Button>
          <Button type='link' onClick={() => props.setUploadId('')}>
            Remove
          </Button>
        </div>
      ) : null}
    </div>
  )
}
export default UploadImg

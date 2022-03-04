import { useContext, useRef } from 'react'
import { MyContext, StaticService } from 'storage'
import { IconUploadVideo } from 'utility/icon'
import VideoPlayer from './VideoPlayer'
import GlobalApi from 'api/GlobalApi'
import { Button, message } from 'antd'

interface IProps {
  type: string
  desc: string
  system: string
  systemId: string
  archiveId: string
  setUploadId: (id: string) => void
}

const UploadVideo = (props: IProps) => {
  const context = useContext(MyContext)
  const api = new GlobalApi()
  const inputEl = useRef<HTMLInputElement>(null)

  const upload = (event: any) => {
    // console.log('event.target.files[0]:', event.target.files[0].size, 'bytes')
    if (
      event.target.files[0] &&
      event.target.files[0].size > StaticService.uploadVideoMaxSize
    ) {
      message.error('The file size exceeds 300mb. Please use another one.')
    } else {
      context.setIsLoading(true)
      api
        .uploadVideo(event.target.files[0], props.system, props.systemId)
        .then((res: any) => {
          props.setUploadId(res.data.id)
          event.target.value = ''
        })
        .finally(() => context.setIsLoading(false))
    }
  }

  return (
    <div className={`ad-upload ${props.type} dark`}>
      <label>
        {props.archiveId ? (
          <VideoPlayer id={props.archiveId} />
        ) : (
          <span className='ad-upload-watermark'>
            <IconUploadVideo />
            <em>{props.desc}</em>
          </span>
        )}
        <input
          ref={inputEl}
          style={{ display: 'none' }}
          type='file'
          accept='.mp4'
          multiple={false}
          onChange={upload}
        />
      </label>
      {props.archiveId ? (
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
export default UploadVideo

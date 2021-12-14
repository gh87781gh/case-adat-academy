import { useContext, useRef } from 'react'
import { MyContext, StaticService } from 'storage'
import { IconUploadVideo } from 'utility/icon'
import GlobalApi from 'api/GlobalApi'
import { Button } from 'antd'
import VideoJS from 'view/admin/course/courseDetail/VideoJS'

interface IProps {
  type: string
  desc: string
  system: string
  systemId: string
  imgId: string
  setUploadId: (id: string) => void
}

const UploadVideo = (props: IProps) => {
  const context = useContext(MyContext)
  const api = new GlobalApi()
  const inputEl = useRef<HTMLInputElement>(null)

  const playerRef = useRef<any>(null)
  const videoJsOptions: any = {
    // lookup the options in the docs for more options
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: `${StaticService.apiUrl}/archive/${props.imgId}`,
        type: 'video/mp4'
      }
    ]
  }

  const handlePlayerReady = (player: any) => {
    playerRef.current = player

    // you can handle player events here
    player.on('waiting', () => {
      console.log('player is waiting')
    })

    player.on('dispose', () => {
      console.log('player will dispose')
    })
  }

  const upload = (event: any) => {
    // console.log('event.target.files[0]:', event.target.files[0])
    if (event.target.files[0]) {
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
    <div className={`ad-upload ${props.type}`}>
      <label>
        {props.imgId ? (
          <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
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
export default UploadVideo

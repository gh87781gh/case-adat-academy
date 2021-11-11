import { useState, useContext, useRef } from 'react'
import { MyContext, StaticService } from 'storage'
import { IconUploadPic } from 'utility/icon'
import { Button, Input, message } from 'antd'

interface IProps {
  type: string
  desc: string
  recommendSize: string
  imgId: string
  setUploaded: (base64: string) => void
}
interface IState {}

const UploadImg = (props: IProps) => {
  const context = useContext(MyContext)
  const inputEl = useRef<HTMLInputElement>(null)
  const [base64, setBase64] = useState<string>('')

  const upload = (event: any) => {
    const getBase64 = (file: any) => {
      return new Promise((resolve: any, reject: any) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          resolve(reader.result)
          // TOCHECK 等api好後，處理上傳圖片轉成id這段func
        }
        reader.onerror = () => {
          reject(false)
        }
      })
    }
    for (const file of event.target.files) {
      file.size <= StaticService.uploadImgMaxSize
        ? getBase64(file)
            .then((res: any) => {
              setBase64(res)
            })
            .catch(() => {
              message.error('檔案上傳失敗')
            })
        : message.error('檔案大小不得超過 5 MB')
    }
  }

  return (
    <div className={`ad-upload ${props.type}`}>
      <label>
        {base64 ? (
          <img className='ad-upload-uploaded' src={base64} alt='' />
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
      <p>
        Format should be .png, .jpg, .jpeg
        <br /> Recommend size {props.recommendSize} (&lt; 5 MB)
      </p>
      {base64 ? (
        <div className='ad-btn-group'>
          <Button type='link' onClick={() => inputEl.current?.click()}>
            Replace
          </Button>
          <Button type='link' onClick={() => props.setUploaded('')}>
            Remove
          </Button>
        </div>
      ) : null}
    </div>
  )
}
export default UploadImg

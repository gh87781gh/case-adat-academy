import {
  RestAPI,
  RestAPIUploadImg,
  RestAPIUploadVideo
} from './engine/axiosRunner'

export default class GlobalApi {
  restAPI: any = new RestAPI()
  restAPIUploadImg: any = new RestAPIUploadImg()
  restAPIUploadVideo: any = new RestAPIUploadVideo()

  getAuth = () => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('get', '/auth', {})
        .then((res: any) => {
          resolve(res)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
  getOptions = (keys: string[]) => {
    return this.restAPI.request('post', '/option', { type: keys })
  }
  uploadImg = (file: any, system: string, system_id: string | undefined) => {
    var formData = new FormData()
    formData.append('file', file)
    formData.append('system', system_id ? system : 'temp')
    formData.append('system_id', system_id ?? '')
    return this.restAPIUploadImg.request('post', '/archive/image', formData)
  }
  uploadVideo = (file: any, system: string, system_id: string) => {
    var formData = new FormData()
    formData.append('file', file)
    formData.append('system', system)
    formData.append('system_id', system_id)
    return this.restAPIUploadVideo.request('post', '/archive/video', formData)
  }
}

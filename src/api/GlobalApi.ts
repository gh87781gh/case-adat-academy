import { RestAPI, RestAPIUpload } from './engine/axiosRunner'
import { message } from 'antd'

export default class GlobalApi {
  restAPI: any = new RestAPI()
  restAPIUpload: any = new RestAPIUpload()

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
    return this.restAPI.request('get', '/auth', {})
  }
  getOptions = (keys: string[]) => {
    return this.restAPI.request('post', '/option', { type: keys })
  }
  uploadImg = (file: any, system: string, system_id: string) => {
    var formData = new FormData()
    formData.append('file', file)
    formData.append('system', system)
    formData.append('system_id', system_id)
    return this.restAPIUpload.request('post', '/archive/image', formData)
  }
  uploadVideo = (file: any, system: string, system_id: string) => {
    var formData = new FormData()
    formData.append('file', file)
    formData.append('system', system)
    formData.append('system_id', system_id)
    return this.restAPIUpload.request('post', '/archive/video', formData)
  }
}

import { RestAPI, RestAPIUpload } from './engine/axiosRunner'

export default class GlobalApi {
  restAPI: any = new RestAPI()
  restAPIUpload: any = new RestAPIUpload()

  getAuth = () => {
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
}

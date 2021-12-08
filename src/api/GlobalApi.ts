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
  uploadImg = (system: string, file: any, system_id?: string) => {
    var bodyFormData = new FormData()
    bodyFormData.append('image', file)
    const data: any = {
      system,
      // file: bodyFormData,
      file,
      system_id
    }
    console.log('data;', data)
    return this.restAPIUpload.request('post', '/archive/image', data)
  }
}

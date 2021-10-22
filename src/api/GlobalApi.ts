import { RestAPI } from './engine/axiosRunner'

export default class GlobalApi {
  restAPI: any = new RestAPI()
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
}

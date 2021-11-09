import { RestAPI } from './engine/axiosRunner'

export default class AdminApi {
  restAPI: any = new RestAPI()
  getAdmins = () => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('get', '/admin', {})
        .then((res: any) => {
          res.forEach((item: any, index: number) => (item.key = index))
          resolve(res)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
  createAdmin = (data: any) => {
    return this.restAPI.request('post', '/admin', data)
  }
}

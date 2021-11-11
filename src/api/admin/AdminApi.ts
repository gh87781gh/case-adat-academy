import { RestAPI } from '../engine/axiosRunner'

export default class AdminApi {
  restAPI: any = new RestAPI()
  getAdmins = (data: any) => {
    const query: any = []
    Object.keys(data).forEach((key: string) => {
      if (data[key]) query.push(`${key}=${data[key]}`)
    })

    return new Promise((resolve, reject) => {
      this.restAPI
        .request('get', `/admin?${query.join('&')}`, {})
        .then((res: any) => {
          res.data.forEach((item: any, index: number) => {
            item.key = index
          })
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
  getAdminDetail = (id: string) => {
    return this.restAPI.request('get', `/admin/${id}`, {})
  }
  editAdmin = (id: string, data: any) => {
    return this.restAPI.request('post', `/admin/${id}`, data)
  }
}

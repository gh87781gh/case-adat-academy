import { RestAPI } from './engine/axiosRunner'

export default class AccountApi {
  restAPI: any = new RestAPI()
  getUserPurchases = () => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('get', '/user/purchase', {})
        .then((res: any) => {
          res.forEach((item: any, index: number) => (item.key = index))
          resolve(res)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
  getAccounts = () => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('get', '/user', {})
        .then((res: any) => {
          res.forEach((item: any, index: number) => (item.key = index))
          resolve(res)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
  addAccount = (data: any) => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('post', '/user/purchase', data)
        .then(() => {
          resolve(true)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
  getAccountRecord = (id: string) => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('get', `/user/${id}/record`, {})
        .then((res: any) => {
          res.forEach((item: any, index: number) => (item.key = index))
          resolve(res)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
}

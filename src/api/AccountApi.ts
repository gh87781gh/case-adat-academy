import { RestAPI } from './engine/axiosRunner'
import { formatDate } from 'utility/format'

export default class AccountApi {
  restAPI: any = new RestAPI()
  getAccounts = () => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('get', '/account', {})
        .then((res: any) => {
          res.forEach((item: any, index: number) => (item.key = index))
          resolve(res)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
  getAccountPurchases = () => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('get', '/account/purchase', {})
        .then((res: any) => {
          res.forEach((item: any, index: number) => {
            item.duration_start = formatDate(item.duration_start)
            item.duration_end = formatDate(item.duration_end)
            item.key = index
          })
          resolve(res)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
  createAccount = (data: any) => {
    return this.restAPI.request('post', '/account/purchase', data)
  }
  editAccount = (id: string, data: any) => {
    return this.restAPI.request('post', `/account/${id}`, data)
  }
  getAccountDetail = (id: string) => {
    return this.restAPI.request('get', `/account/${id}`, {})
  }
  getAccountRecord = (id: string) => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('get', `/account/${id}/records`, {})
        .then((res: any) => {
          res.forEach((item: any, index: number) => {
            item.created_at = formatDate(item.created_at)
            item.key = index
          })
          resolve(res)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
  switchAccountStatus = (id: string, enable: boolean) => {
    return this.restAPI.request('post', `/account/${id}/enable`, { enable })
  }
}

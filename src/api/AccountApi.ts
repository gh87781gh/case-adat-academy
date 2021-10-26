import { RestAPI } from './engine/axiosRunner'
import moment from 'moment'

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
  createAccount = (data: any) => {
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
  editAccount = (id: string, data: any) => {
    // TOCHECK user_id 應改為 purchase_id
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('post', `/user/${id}`, data)
        .then(() => {
          resolve(true)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
  getAccountDetail = (id: string) => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('get', `/user/${id}`, {})
        .then((res: any) => {
          resolve(res)
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
          res.forEach((item: any, index: number) => {
            item.created_at = moment(item.created_at).format('YYYY/MM/DD')
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
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('post', `/user/${id}/enable`, { enable })
        .then(() => {
          resolve(true)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
}

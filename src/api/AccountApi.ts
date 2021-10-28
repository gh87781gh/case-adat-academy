import { RestAPI } from './engine/axiosRunner'
import moment from 'moment'

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
        .request('post', '/account/purchase', data)
        .then(() => {
          resolve(true)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
  editAccount = (id: string, data: any) => {
    // TOCHECK purchase_id 應改為 account_id？
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('post', `/account/${id}`, data)
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
        .request('get', `/account/${id}`, {})
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
        .request('get', `/account/${id}/record`, {})
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
        .request('post', `/account/${id}/enable`, { enable })
        .then(() => {
          resolve(true)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
}

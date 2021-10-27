import { RestAPI } from './engine/axiosRunner'
import { notification } from 'antd'

export default class LoginApi {
  restAPI: any = new RestAPI()

  login = (data: any) => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('post', '/auth/login', data)
        .then((res: any) => {
          resolve(res)
        })
        .catch((err: any) => {
          reject(err.message)
        })
    })
  }
  checkAccount = (data: any) => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('post', '/auth/check', data)
        .then((res: any) => {
          if (res.is_exist)
            notification.error({
              message: 'The User ID or Email is exist.',
              description: ''
            })
          resolve(res.is_exist)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
  create = (data: any) => {
    data.is_login = false //true -> 順便登入,並返回token
    data.experience = data.experience.join(',')
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('post', '/auth/signup', data)
        .then((res: any) => {
          resolve(res)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
  recoverPassword = (data: any) => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('post', '/auth/pwd_recover', data)
        .then((res: any) => {
          resolve(res)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
  contact = (data: any) => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('post', '/contact', data)
        .then((res: any) => {
          resolve(res)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
}

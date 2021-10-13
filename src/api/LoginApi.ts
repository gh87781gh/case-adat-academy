import { RestAPI } from './engine/axiosRunner'
import { notification } from 'antd'
import { resMsg } from './engine/resMsg'

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
              message: resMsg.accountExist,
              description: ''
            })
          resolve(res.is_exist)
        })
        .catch((err: any) => {
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
        .catch((err: any) => {
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
        .catch((err: any) => {
          reject(false)
        })
    })
  }
  // getUserProfile = (uuid: string) => {
  //   return new Promise((resolve, reject) => {
  //     this.restAPI
  //       .request('get', `/password/temp/${uuid}`, {})
  //       .then((res: any) => {
  //         resolve(res)
  //       })
  //       .catch((err: any) => {
  //         reject(false)
  //       })
  //   })
  // }
  contact = (data: any) => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('post', '/contact', data)
        .then((res: any) => {
          resolve(res)
        })
        .catch((err: any) => {
          reject(false)
        })
    })
  }
}

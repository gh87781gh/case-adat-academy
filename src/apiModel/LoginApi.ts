import { RestAPI } from './engine/axiosRunner'

export default class LoginApi {
  restAPI: any = new RestAPI()

  login = (data: any) => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('post', '/login', data)
        .then((res: any) => {
          resolve(res)
        })
        .catch((err: any) => {
          reject(err.msg)
        })
    })
  }
  createCheck = (data: any) => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('post', '/create/check', data)
        .then((res: any) => {
          resolve(res)
        })
        .catch((err: any) => {
          reject(err.msg)
        })
    })
  }
  create = (data: any) => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('post', '/create', data)
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
        .request('post', '/password/recover', data)
        .then((res: any) => {
          resolve(res)
        })
        .catch((err: any) => {
          reject(false)
        })
    })
  }
  getUserProfile = (uuid: string) => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('get', `/password/temp/${uuid}`, {})
        .then((res: any) => {
          resolve(res)
        })
        .catch((err: any) => {
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
        .catch((err: any) => {
          reject(err.msg)
        })
    })
  }
}

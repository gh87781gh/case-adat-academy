import { RestAPI } from './engine/axiosRunner'

export default class LoginApi {
  restAPI: any = new RestAPI()

  login = (data: any) => {
    data.keep = false
    data.scope = ['account', 'name', 'permission']
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('post', '/auth/login', data)
        .then((res: any) => {
          resolve(res)
        })
        .catch((err: any) => {
          reject(err.msg)
        })
    })
  }
  checkAccount = (data: any) => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('post', '/auth/check', data)
        .then((res: any) => {
          resolve(res)
        })
        .catch((err: any) => {
          reject(false)
        })
    })
  }
  create = (data: any) => {
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
  // recoverPassword = (data: any) => {
  //   return new Promise((resolve, reject) => {
  //     this.restAPI
  //       .request('post', '/password/recover', data)
  //       .then((res: any) => {
  //         resolve(res)
  //       })
  //       .catch((err: any) => {
  //         reject(false)
  //       })
  //   })
  // }
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

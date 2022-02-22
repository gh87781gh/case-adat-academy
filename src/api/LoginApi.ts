import { RestAPI } from './engine/axiosRunner'

export default class LoginApi {
  restAPI: any = new RestAPI()

  login = (data: any) => {
    data.account = data.account.trim() //TODO 等著拿掉
    return this.restAPI.request('post', '/auth/login', data, true)
  }
  checkAccount = (data: any) => {
    const toCheck = {
      user_id: data.user_id,
      email: data.email
    }
    return this.restAPI.request('post', '/auth/check', toCheck)
  }
  signUp = (data: any) => {
    return this.restAPI.request('post', '/auth/signup', data)
  }
  signUpEmailVerify = (verification_code: string) => {
    return this.restAPI.request('post', '/auth/email/verify', {
      verification_code
    })
  }
  recoverPassword = (data: any) => {
    return this.restAPI.request('post', '/recovery/submit', data, true)
  }
  recoverPasswordVerify = (temporary_password: string) => {
    return this.restAPI.request('post', '/recovery/verify', {
      temporary_password
    })
  }
  changePassword = (data: any) => {
    return this.restAPI.request('post', '/recovery/change', data)
  }
  contact = (data: any) => {
    return this.restAPI.request('post', '/contact', data)
  }
}

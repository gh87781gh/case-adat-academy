import { RestAPI } from './engine/axiosRunner'

export default class LoginApi {
  restAPI: any = new RestAPI()

  login = (data: any) => {
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
    const sendData = {
      ...data,
      is_login: false // true -> 順便登入,並返回token
    }
    return this.restAPI.request('post', '/auth/signup', sendData)
  }
  recoverPassword = (data: any) => {
    return this.restAPI.request('post', '/recovery/submit', data, true)
  }
  contact = (data: any) => {
    return this.restAPI.request('post', '/contact', data)
  }
}

import { RestAPI } from './engine/axiosRunner'

export default class LoginApi {
  restAPI: any = new RestAPI()

  login = (data: any) => {
    return this.restAPI.request('post', '/auth/login', data)
  }
  checkAccount = (data: any) => {
    const toCheck = {
      user_id: data.user_id,
      email: data.email
    }
    return this.restAPI.request('post', '/auth/check', toCheck)
  }
  getSignUpOptions = () => {
    // TOCHECK 這支要廢掉，換從option拿
    return this.restAPI.request('get', '/auth/signup', {})
  }
  create = (data: any, experienceStrAry: string[]) => {
    const sendData = {
      user_id: data.user_id,
      password: data.password,
      email: data.email,
      industry: data.industry,
      profession: data.profession,
      current_company: data.current_company,
      experience_level: data.experience_level,
      experience: experienceStrAry,
      is_login: false // true -> 順便登入,並返回token
    }
    return this.restAPI.request('post', '/auth/signup', sendData)
  }
  recoverPassword = (data: any) => {
    // TOCHECK 這支未完成
    return this.restAPI.request('post', '/auth/pwd_recover', data)
  }
  contact = (data: any) => {
    return this.restAPI.request('post', '/contact', data)
  }
}

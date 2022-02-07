import { RestAPI } from '../engine/axiosRunner'

export default class AccountApi {
  restAPI: any = new RestAPI()
  getLearningProfile = () => {
    return this.restAPI.request('get', '/user/profile', {})
  }
  updateLearningProfile = (data: any) => {
    return this.restAPI.request('get', '/user/profile', data)
  }
  changePassword = (data: any) => {
    delete data.change_password2
    return this.restAPI.request('post', '/user/password', data)
  }
}

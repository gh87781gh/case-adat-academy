import { RestAPI } from '../engine/axiosRunner'

export default class AccountApi {
  restAPI: any = new RestAPI()
  getUserProfile = () => {
    return this.restAPI.request('get', '/user/profile', {})
  }
  updateUserProfile = (data: any) => {
    return this.restAPI.request('get', '/user/profile', data)
  }
  getUserPurchase = () => {
    return this.restAPI.request('get', '/user/purchase', {})
  }
  getUserEmail = () => {
    return this.restAPI.request('get', '/user/email', {})
  }
  changePassword = (data: any) => {
    delete data.change_password2
    return this.restAPI.request('post', '/user/password', data)
  }
}

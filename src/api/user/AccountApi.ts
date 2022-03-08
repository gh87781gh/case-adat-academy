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
  updateUserEmail = (data: any) => {
    const sendData: any = {
      have_purchase_number:
        data.have_purchase_number === 'true'
          ? true
          : data.have_purchase_number === 'false'
          ? false
          : null,
      email: data.email,
      purchase_number:
        data.have_purchase_number === 'true' ? data.purchase_number : null,
      password: data.password
    }
    return this.restAPI.request('get', '/user/email', sendData)
  }
  getUserEmail = () => {
    return this.restAPI.request('get', '/user/email', {})
  }
  changePassword = (data: any) => {
    delete data.change_password2
    return this.restAPI.request('post', '/user/password', data)
  }
}

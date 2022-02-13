import { RestAPI } from '../engine/axiosRunner'

export default class AccountApi {
  restAPI: any = new RestAPI()
  getUserProfile = () => {
    return this.restAPI.request('get', '/user/purchase', {})
  }
  updateUserProfile = (data: any) => {
    return this.restAPI.request('get', '/user/profile', data)
  }
  changePassword = (data: any) => {
    delete data.change_password2
    return this.restAPI.request('post', '/user/password', data)
  }
}
// "user_id": "",
// "status": "",
// "current_email": "",
// "purchase_number": "",
// "company": "",
// "duration_start": "",
// "duration_end": "",
// "course_access": ""

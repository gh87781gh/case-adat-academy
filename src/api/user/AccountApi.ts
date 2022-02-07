import { RestAPI } from '../engine/axiosRunner'

export default class AccountApi {
  restAPI: any = new RestAPI()
  getLearningProfile = () => {
    return this.restAPI.request('get', '/user/profile', {})
  }
  updateLearningProfile = (data: any) => {
    return this.restAPI.request('get', '/user/profile', data)
  }
}

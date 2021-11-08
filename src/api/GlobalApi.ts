import { RestAPI } from './engine/axiosRunner'

export default class GlobalApi {
  restAPI: any = new RestAPI()
  getAuth = () => {
    return this.restAPI.request('get', '/auth', {})
  }
}

import { RestAPI } from '../engine/axiosRunner'

export default class HelpCenterApi {
  restAPI: any = new RestAPI()
  sendHelpCenterContactUs = (data: any) => {
    return this.restAPI.request('post', '/help', data)
  }
}

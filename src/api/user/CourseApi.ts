import { RestAPI } from '../engine/axiosRunner'

export default class CourseApi {
  restAPI: any = new RestAPI()
  getBannerLearningPath = () => {
    return this.restAPI.request('get', '/user/learn', {})
  }
}

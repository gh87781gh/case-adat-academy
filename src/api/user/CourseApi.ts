import { RestAPI } from '../engine/axiosRunner'

export default class CourseApi {
  restAPI: any = new RestAPI()
  getBannerLearningPath = () => {
    return this.restAPI.request('get', '/user/learn', {})
  }
  getCoursesByLearningPath = (coursesType: string, data: any) => {
    const query: any = []
    Object.keys(data).forEach((key: string) => {
      if (data[key]) query.push(`${key}=${data[key]}`)
    })
    return this.restAPI.request(
      'get',
      `/user/${coursesType}?${query.join('&')}`,
      {}
    )
  }
  getCourseDetail = (id: string) => {
    return this.restAPI.request('get', `/user/course/${id}`, {})
  }
}

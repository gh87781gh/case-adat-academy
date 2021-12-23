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

    return new Promise((resolve, reject) => {
      this.restAPI
        .request('get', `/user/${coursesType}?${query.join('&')}`, {})
        .then((res: any) => {
          res.data.forEach((item: any, index: number) => {
            item.key = index
          })
          resolve(res)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
}

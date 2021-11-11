import { RestAPI } from '../engine/axiosRunner'
import { formatDateTime } from 'utility/format'

export default class CourseApi {
  restAPI: any = new RestAPI()
  getCourses = (data: any) => {
    const query: any = []
    Object.keys(data).forEach((key: string) => {
      if (data[key]) query.push(`${key}=${data[key]}`)
    })

    return new Promise((resolve, reject) => {
      this.restAPI
        .request('get', `/course?${query.join('&')}`, {})
        .then((res: any) => {
          res.data.forEach((item: any, index: number) => {
            item.last_update_time = formatDateTime(item.last_update_time)
            item.key = index
          })
          resolve(res)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
  getCourseDetail = (id: string) => {
    return this.restAPI.request('get', `/course/${id}`, {})
  }
  createCourse = (data: any) => {
    return this.restAPI.request('post', '/course', data)
  }
  editCourse = (id: string, data: any) => {
    return this.restAPI.request('post', `/course/${id}`, data)
  }
  switchCourse = (id: string, enable: boolean) => {
    // TOCHECK activate 後端檢查還沒做
    return this.restAPI.request('post', `/course/${id}/active`, { enable })
  }
}

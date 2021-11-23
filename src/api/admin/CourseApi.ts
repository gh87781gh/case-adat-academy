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

  // TOCHECK
  getCourseMenu = () => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('get', '/learn', {})
        .then((res: any) => {
          // res.data.forEach((item: any, index: number) => {
          //   item.last_update_time = formatDateTime(item.last_update_time)
          //   item.key = index
          // })
          resolve(res)
        })
        .catch(() => {
          reject(false)
        })
    })
  }

  getLearnGoals = () => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('get', '/learn', {})
        .then((res: any) => {
          res.data = res.data.map((item: any, index: number) => {
            return { goal: item, key: index }
          })
          resolve(res)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
  getLearnGoalDetail = (goal: string) => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('get', `/learn/${goal}`, {})
        .then((res: any) => {
          const ary: any = []
          res.data.forEach((stage: any, stageIndex: number) => {
            ary.push({
              level: 'A',
              key: `${stageIndex}`,
              text: stage.name,
              isShowChildren: stage.courses.length > 0 ? true : null,
              isShow: true
            })
            stage.courses.forEach((course: any, courseIndex: number) => {
              ary.push({
                level: 'B',
                key: `${stageIndex}-${courseIndex}`,
                text: course.name,
                isShowChildren: null,
                isShow: true,
                id: course.id,
                enable: course.enable
              })
            })
          })
          resolve(ary)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
}

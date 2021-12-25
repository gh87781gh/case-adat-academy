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
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('get', `/user/course/${id}`, {})
        .then((res: any) => {
          let indexA: number = 0
          let indexB: number = 0
          let indexC: number = 0
          res.data.forEach((item: any, index: number) => {
            switch (item.level) {
              case 1:
                if (indexA !== 0) {
                  indexB = 0
                  indexC = 0
                }
                indexA++
                item.key = `${indexA}`
                break
              case 2:
                indexB++
                item.key = `${indexA}-${indexB}`
                break
              case 3:
                indexC++
                item.key = `${indexA}-${indexB}-${indexC}`
                break
            }
          })
          // TODO 轉成巢狀結構以因應 ui 的 menu component

          console.log('test:', res.data)
          resolve(res)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
}

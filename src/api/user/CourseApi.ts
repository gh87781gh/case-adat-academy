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
  getBookmarks = (data: any) => {
    const query: any = []
    Object.keys(data).forEach((key: string) => {
      if (data[key]) query.push(`${key}=${data[key]}`)
    })
    return this.restAPI.request('get', `/user/bookmark?${query.join('&')}`, {})
  }
  cancelBookmark = (courseId: string, sectionId: string) => {
    return this.restAPI.request(
      'delete',
      `/user/bookmark/${courseId}/${sectionId}`,
      {}
    )
  }
  getCourseDetail = (id: string) => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('get', `/user/course/${id}`, {})
        .then((res: any) => {
          // add key on every item
          let keyA: number = 0
          let keyB: number = 0
          let keyC: number = 0

          // 轉成巢狀結構以因應 ui 的 menu component
          let newAry: any = []
          let newIndexA: number | null = null
          let newIndexB: number | null = null

          // let selectedKeys: any = [] // current section
          // let menuOpenKeys: any = [] // all open group and chapter keys

          res.data.forEach((item: any, index: number) => {
            switch (item.level) {
              case 1:
                if (keyA !== 0) {
                  keyB = 0
                  keyC = 0
                }
                keyA++
                item.key = `${keyA}`
                newAry.push(item)
                newIndexA === null ? (newIndexA = 0) : newIndexA++
                newAry[newIndexA].children = []
                break
              case 2:
                keyB++
                item.key = `${keyA}-${keyB}`
                if (newIndexA !== null) {
                  newAry[newIndexA].children.push(item)
                  newIndexB === null ? (newIndexB = 0) : newIndexB++
                  newAry[newIndexA].children[newIndexB].children = []
                }
                break
              case 3:
                keyC++
                item.key = `${keyA}-${keyB}-${keyC}`
                if (newIndexA !== null && newIndexB !== null) {
                  newAry[newIndexA].children[newIndexB].children.push(item)
                }

                break
            }
          })
          res.data = newAry
          resolve(res)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
  getCurrentSection = (courseId: string, sectionId: string) => {
    return this.restAPI.request(
      'get',
      `/user/course/${courseId}/${sectionId}`,
      {}
    )
  }
  switchIsBookmarked = (
    courseId: string,
    sectionId: string,
    isBookmarked: boolean
  ) => {
    return this.restAPI.request(
      `${isBookmarked ? 'delete' : 'post'}`,
      `/user/bookmark/${courseId}/${sectionId}`,
      {}
    )
  }
  markAsRead = (courseId: string, sectionId: string) => {
    return this.restAPI.request(
      'post',
      `/user/course/${courseId}/${sectionId}`,
      { is_finished: true }
    )
  }
}

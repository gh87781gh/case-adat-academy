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
          let indexA: number = 0
          let indexB: number = 0
          let indexC: number = 0
          res.data.forEach((item: any, index: number, ary: any) => {
            const level = item.level
            const nextLevel = ary[index + 1]?.level

            let isShowChildren = null
            if (nextLevel && level < nextLevel) isShowChildren = true // 預設展開 child

            switch (item.level) {
              case 1:
                if (indexA !== 0) {
                  indexB = 0
                  indexC = 0
                }
                indexA++
                item.key = `${indexA}`
                item.isShowChildren = isShowChildren
                item.isShow = true
                break
              case 2:
                indexB++
                item.key = `${indexA}-${indexB}`
                item.isShowChildren = isShowChildren
                item.isShow = true
                break
              case 3:
                indexC++
                item.key = `${indexA}-${indexB}-${indexC}`
                item.isShowChildren = null
                item.isShow = true
                break
            }
            item.index = index
          })

          let level1s: any = []
          for (const item of res.data) {
            // collect level 1
            if (item.level === 1) {
              item.children = []
              level1s.push(item)
            }
          }
          // collect level 2
          for (const item of res.data) {
            if (item.level === 2) {
              for (const el1 of level1s) {
                if (el1.key === item.key.split('-')[0]) {
                  item.children = []
                  el1.children.push(item)
                }
              }
            }
          }
          // collect level 3
          for (const item of res.data) {
            if (item.level === 3) {
              for (const el1 of level1s) {
                for (const el2 of el1.children) {
                  const aryStr = item.key.split('-')
                  if (el2.key === `${aryStr[0]}-${aryStr[1]}`) {
                    el2.children.push(item)
                    break
                  }
                }
              }
            }
          }
          // console.log('level1s:', level1s)
          res.data = level1s
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
  getIsBookmarked = (courseId: string, sectionId: string) => {
    return this.restAPI.request(
      'get',
      `/user/bookmark/${courseId}/${sectionId}`,
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

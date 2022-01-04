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
          // add key on every item
          let keyA: number = 0
          let keyB: number = 0
          let keyC: number = 0

          // 轉成巢狀結構以因應 ui 的 menu component
          let newAry: any = []
          let newIndexA: number | null = null
          let newIndexB: number | null = null

          let selectedKeys: any = [] // current section
          let menuOpenKeys: any = [] // all open group and chapter keys

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

                // If has no last read record, get the first section to be the default active key
                if (!res.last_read_section_id && selectedKeys.length === 0) {
                  selectedKeys.push(item.key)
                }

                break
            }
          })

          res.data.forEach((item: any) => {
            // all submenu open for default
            if (item.level === 1 || item.level === 2) {
              menuOpenKeys.push(item.key)
            }

            // If has last read record, use it to be the default active key
            if (
              res.last_read_section_id &&
              res.last_read_section_id === item.id
            ) {
              selectedKeys.push(item.key)
            }
          })

          res.menuOpenKeys = menuOpenKeys
          res.selectedKeys = selectedKeys
          res.data = newAry
          resolve(res)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
  switchIsBookmarked = (courseId: string, isBookmarked: boolean) => {
    return this.restAPI.request(
      `${isBookmarked ? 'delete' : 'post'}`,
      `/user/bookmark/${courseId}`,
      {}
    )
  }
}

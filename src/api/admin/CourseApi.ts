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
  getCourseDetailMenu = (type: string, courseId: string) => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('get', `/course/${courseId}/chapter`, {})
        .then((res: any) => {
          // both type = MENU and EDIT
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

          // only type = MENU
          if (type === 'MENU') {
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
            res.data = level1s
          }
          resolve(res)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
  editCourseDetailMenu = (courseId: string, data: any) => {
    const ary = data.map((item: any) => {
      return {
        id: item.id || '',
        level: item.level,
        name: item.name
      }
    })
    return this.restAPI.request('post', `/course/${courseId}/chapter`, ary)
  }
  getCurrentSectionContent = (courseId: string, sectionId: string) => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('get', `/course/${courseId}/${sectionId}`, {})
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
  saveCurrentSectionContent = (
    courseId: string,
    sectionId: string,
    data: any
  ) => {
    for (const item of data) {
      delete item.key
    }
    return this.restAPI.request(
      'post',
      `/course/${courseId}/${sectionId}`,
      data
    )
  }

  // NOTE 確認到以上

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

  getLearnCourses = () => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('get', '/course', {})
        .then((res: any) => {
          const ary = res.data.map((item: any, index: number) => {
            return {
              key: index,
              id: item.id,
              name: item.name,
              enable: item.enable
            }
          })
          resolve(ary)
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
              level: 1,
              key: `${stageIndex}`,
              name: stage.name,
              isShowChildren: stage.courses.length > 0 ? true : null,
              isShow: true
            })
            stage.courses.forEach((course: any, courseIndex: number) => {
              ary.push({
                level: 'B',
                key: `${stageIndex}-${courseIndex}`,
                name: course.name,
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
  uploadLearn = (name: string, data: any) => {
    const ary: any = [...data]
    for (const item of data) {
      if (item.level === 1) item.courses = []
      if (item.level === 'B') {
      }
    }
    ary.forEach((item: any, index: number, array: any) => {
      if (item.level === 1) item.courses = []
      if (item.level === 'B') {
        const parentIndex: number = array.findIndex(
          (el: any) => el.key === item.key.split('-')[0]
        )
        array[parentIndex].courses.push({ id: item.id })
      }
    })
    const sendData: any = []
    for (const item of ary) {
      if (item.level === 1)
        sendData.push({ name: item.name, courses: item.courses })
    }
    return this.restAPI.request('post', `/learn/${name}`, sendData)
  }
}

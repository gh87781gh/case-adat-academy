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
  getCourseDetailMenu = (type: string, id: string) => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('get', `/course/${id}/chapter`, {})
        .then((res: any) => {
          if (type === 'MENU') {
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
          } else if (type === 'EDIT') {
            // TODO
            // let indexA: number = 0
            // let indexB: number = 0
            // let indexC: number = 0
            // res.data.forEach((item: any, index: number, ary: any) => {
            //   const level = item.level
            //   const nextLevel = ary[index + 1]?.level
            //   const isShowChildren: boolean | null =
            //     level < nextLevel ? true : null // 預設展開 child
            //   switch (item.level) {
            //     case 1:
            //       if (indexA !== 0) {
            //         indexB = 0
            //         indexC = 0
            //       }
            //       indexA++
            //       item.key = `${indexA}`
            //       item.isShowChildren = isShowChildren
            //       item.isShow = true
            //       break
            //     case 2:
            //       indexB++
            //       item.key = `${indexA}-${indexB}`
            //       item.isShowChildren = true
            //       item.isShow = true
            //       break
            //     case 3:
            //       indexC++
            //       item.key = `${indexA}-${indexB}-${indexC}`
            //       item.isShowChildren = null
            //       item.isShow = true
            //       item.sections.forEach((el: any, i: number) => {
            //         el.key = `${i}`
            //       })
            //       break
            //   }
            //   item.index = index
            // })
          }
          resolve(res)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
  getCurrentSection = (courseId: string, sectionId: string) => {
    return this.restAPI.request('get', `/course/${courseId}/${sectionId}`, {})
  }

  // NOTE 確認到以上

  editCourseChapter = (id: string, data: any) => {
    const ary = data.map((chapter: any) => {
      return {
        name: chapter.name,
        level: chapter.level,
        sections: chapter.sections.map((content: any) => {
          return {
            archive_id: content.archive_id,
            content: content.content,
            type: content.type
          }
        })
      }
    })
    return this.restAPI.request('post', `/course/${id}/chapter`, ary)
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

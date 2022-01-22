import { RestAPI } from '../engine/axiosRunner'

export default class SearchApi {
  restAPI: any = new RestAPI()
  getSearchResult = (text: string, data: any) => {
    const query: any = []
    Object.keys(data).forEach((key: string) => {
      if (data[key]) query.push(`${key}=${data[key]}`)
    })
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('post', '/user/search', { text })
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

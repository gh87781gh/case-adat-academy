import { RestAPI } from './engine/axiosRunner'

export default class GlobalApi {
  restAPI: any = new RestAPI()

  // getOption = (key: string) => {
  //   return new Promise((resolve, reject) => {
  //     this.restAPI
  //       .request('get', `/option/${key}`, {})
  //       .then((res: any) => {
  //         resolve(res)
  //       })
  //       .catch((err: any) => {
  //         reject(false)
  //       })
  //   })
  // }
}

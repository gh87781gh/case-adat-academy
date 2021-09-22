import axios from 'axios'
import { notification } from 'antd'

import makeServer from './fakeServer'
if (process.env.REACT_APP_ENV === 'DEV') {
  makeServer()
}
// import { createHashHistory } from 'history'
// import { BrowserStoreService } from '../storage/storage'
// import Notification from '../../view/utility/component/notification'

export class ApiEngine {
  // browserStore = new BrowserStoreService()
  // history: any = createHashHistory()
  // instance: any = axios.create()
  config: any = {
    // baseURL:
    //   process.env.REACT_APP_CUSTOM_HOSTNAME === 'true'
    //     ? window.location.origin
    //     : '', // : process.env.REACT_APP_API_URL,
    timeout: 10000,
    headers: {
      // 'X-App-ID': 'test',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }

  // setToken = () => {
  //   // const token = //get token from storage
  //   // if (token) {
  //   //   this.config.headers.Authorization = `Bearer ${authToken}`
  //   // }
  // }

  // setInterceptor = () => {
  //   this.instance.interceptors.response.use(
  //     (res: any) => {
  //       if (res.data && res.data.successMessage)
  //         alert('success' + res.data.successMessage)
  //       return res
  //     },
  //     (err: any) => {
  //       if (err.response) {
  //         switch (err.response.status) {
  //           case 500:
  //             alert('error 500' + '發生系統錯誤，請聯絡管理員')
  //             break
  //           case 403:
  //             alert('error 403' + err.response.data.message)
  //             break
  //           default:
  //             alert('error' + err.response.data.message)
  //         }
  //       }
  //       // if (!window.navigator.onLine) {
  //       //   alert("網路出了點問題，請重新連線後重整網頁");
  //       //   return;
  //       // }
  //       return Promise.reject(false)
  //     }
  //   )
  //   this.instance.interceptors.request.use(
  //     function (config: any) {
  //       // Do something before request is sent
  //       return config
  //     },
  //     function (error: any) {
  //       // Do something with request error
  //       return Promise.reject(error)
  //     }
  //   )
  // }
}

export class RestAPI extends ApiEngine {
  // fake request only for frontend dev
  request = (method: string, url: string, data: any): Promise<any> => {
    const apiUrl = `${process.env.REACT_APP_API_VERSION}${url}`
    return new Promise((resolve, reject) => {
      const handleRes = (res: any) => {
        resolve(res?.data)
      }
      const handleErr = (err: any) => {
        if (!err?.response) {
          //mirage.js error
          console.error(err)
        } else {
          // only login error is not show by notification
          if (err.response.data.code !== 'WRONG_LOGIN_AUTH') {
            notification.error({
              message: '',
              description: err.response.data.msg,
            })
          }
          // api error
          reject(err.response.data)
        }
      }

      switch (method) {
        case 'get':
          axios
            .get(apiUrl, this.config)
            .then((res: any) => {
              handleRes(res)
            })
            .catch((err: any) => {
              handleErr(err)
            })
          break
        case 'post':
          axios
            .post(apiUrl, data, this.config)
            .then((res: any) => {
              handleRes(res)
            })
            .catch((err: any) => {
              handleErr(err)
            })
          break
        default:
      }
    })
  }
  // request = (method: string, url: string, body: any): Promise<any> => {
  //   this.setToken()
  //   this.setInterceptor()
  //   const config = this.config
  //   config.url = this.config.baseURL + url
  //   config.method = method
  //   config[method === 'get' ? 'params' : 'data'] = body
  //   return new Promise((resolve, reject) => {
  //     this.instance
  //       .request(config)
  //       .then((res: any) => {
  //         resolve(res?.data)
  //       })
  //       .catch((err: any) => {
  //         // console.log('err:', err)
  //         reject(false)
  //       })
  //   })
  // }
  // requestBlob = (method: string, url: string, body: any): Promise<any> => {
  //   this.setToken()
  //   this.setInterceptor()
  //   const config = this.config
  //   config.url = this.config.baseURL + url
  //   config.method = method
  //   config[method === 'get' ? 'params' : 'data'] = body
  //   config.responseType = 'blob' // Use blob to transmit the file.
  //   return new Promise((resolve, reject) => {
  //     this.instance
  //       .request(config)
  //       .then((res: any) => {
  //         // Return file and the fileName from response. Backend decide the file name.
  //         resolve({
  //           blob: new Blob([res?.data]),
  //           fileName: res?.headers['content-disposition'].split('filename=')[1],
  //         })
  //       })
  //       .catch(() => {
  //         reject(false)
  //       })
  //   })
  // }
}

import axios from 'axios'
import { notification } from 'antd'
import { StaticService } from '../../storage/storage'

// import { createHashHistory } from 'history'

export class ApiEngine {
  // history: any = createHashHistory()
  instance: any = axios.create()
  config: any = {
    baseURL:
      // process.env.REACT_APP_CUSTOM_HOSTNAME === 'true'
      //   ? window.location.origin:
      process.env.REACT_APP_API_URL,
    timeout: 10000,
    headers: {
      // 'X-App-ID': 'test',
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  }

  // setToken = () => {
  //   // const token = //get token from storage
  //   // if (token) {
  //   //   this.config.headers.Authorization = `Bearer ${authToken}`
  //   // }
  // }

  setInterceptor = (url: string) => {
    this.instance.interceptors.request.use(
      function (config: any) {
        // Do something before request is sent
        return config
      },
      function (error: any) {
        // Do something with request error
        return Promise.reject(error)
      }
    )
    this.instance.interceptors.response.use(
      (res: any) => {
        if (res.data.code === 'SUCCESS')
          notification.success({
            message: '',
            description: 'Success.' //res.data.msg
          })
        return res.data
      },
      (err: any) => {
        if (err.response && url !== '/auth/login')
          notification.error({
            message: '',
            description: err.response.data.msg
          })
        return Promise.reject(err.response.data)
      }
    )
  }
}

export class RestAPI extends ApiEngine {
  request = (method: string, url: string, body: any): Promise<any> => {
    // this.setToken()
    this.setInterceptor(url)
    const config = this.config
    config.url = StaticService.apiUrl + url
    config.method = method
    config[method === 'get' ? 'params' : 'data'] = body
    return new Promise((resolve, reject) => {
      this.instance
        .request(config)
        .then((res: any) => {
          resolve(res)
        })
        .catch((err: any) => {
          reject(err)
        })
    })
  }
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

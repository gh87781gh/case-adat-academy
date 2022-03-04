import { StaticService, BrowserStorage } from '../../storage'
import axios from 'axios'
import { message } from 'antd'
import { createHashHistory } from 'history'
const history = createHashHistory()

export class ApiEngine {
  browserStorage = new BrowserStorage()
  instance: any = axios.create()
  config: any = {
    baseURL: StaticService.apiUrl,
    timeout: 10000,
    headers: {
      // 'Content-Type': 'application/json',
      // Accept: 'application/json'
    }
  }
  setToken = () => {
    const token = this.browserStorage.getStorage('AUTH')
    if (token) {
      this.config.headers.Authorization = `Bearer ${token}`
    }
  }
  setInterceptor = (url: string, isCustomizeErr?: boolean) => {
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
        // TODO 研究為什麼 return res.data.data 時，data這個變數會被污染
        return res
      },
      (err: any) => {
        // console.log(err.response)
        // console.log(err.response.data)
        if (!isCustomizeErr) {
          if (err.response.status === 401) {
            message.error('Unauthorized')
            history.push('/login')
            window.location.reload() //TODO
          } else {
            message.error(err.response.data.message)
          }
        }
        return Promise.reject(err.response.data)
      }
    )
  }
}

export class RestAPI extends ApiEngine {
  /**
   * 物件資料格式的請求方法
   * @param method post/get/delete
   * @param url api網址
   * @param body request data
   * @param boolean (非必要)是否經過 interceptors.response 的全局報錯提示，否->回傳整包錯誤物件
   *
   */
  request = (
    method: string,
    url: string,
    body: any,
    isCustomizeErr?: boolean
  ): Promise<any> => {
    this.setToken()
    this.setInterceptor(url, isCustomizeErr)
    const config = this.config
    config.headers['Content-Type'] = 'application/json'
    config.headers.Accept = 'application/json'
    config.url = StaticService.apiUrl + url
    config.method = method
    config[method === 'get' ? 'params' : 'data'] = body
    return new Promise((resolve, reject) => {
      this.instance
        .request(config)
        .then((res: any) => {
          resolve(res.data)
        })
        .catch((err: any) => {
          if (isCustomizeErr) {
            reject(err)
          } else {
            reject(false)
          }
        })
    })
  }
}
export class RestAPIUploadImg extends ApiEngine {
  request = (
    method: string,
    url: string,
    body: any,
    isCustomizeErr?: boolean
  ): Promise<any> => {
    this.setToken()
    // this.setInterceptor(url, isCustomizeErr)
    const config = this.config
    config.headers['Content-Type'] = 'multipart/form-data'
    // config.headers.Accept = 'application/json'
    config.url = StaticService.apiUrl + url
    config.method = method
    config[method === 'get' ? 'params' : 'data'] = body
    config.timeout = StaticService.uploadImgTimeout
    return new Promise((resolve, reject) => {
      this.instance
        .request(config)
        .then((res: any) => {
          resolve(res.data)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
}
export class RestAPIUploadVideo extends ApiEngine {
  request = (
    method: string,
    url: string,
    body: any,
    isCustomizeErr?: boolean
  ): Promise<any> => {
    this.setToken()
    // this.setInterceptor(url, isCustomizeErr)
    const config = this.config
    config.headers['Content-Type'] = 'multipart/form-data'
    // config.headers.Accept = 'application/json'
    config.url = StaticService.apiUrl + url
    config.method = method
    config[method === 'get' ? 'params' : 'data'] = body
    config.timeout = StaticService.uploadVideoTimeout
    return new Promise((resolve, reject) => {
      this.instance
        .request(config)
        .then((res: any) => {
          resolve(res.data)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
}

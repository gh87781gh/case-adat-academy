import { StaticService, BrowserStorage } from '../../storage'
import axios from 'axios'
import { message } from 'antd'
import { createHashHistory } from 'history'
const history = createHashHistory()

export class ApiEngine {
  browserStorage = new BrowserStorage()
  instance: any = axios.create()
  config: any = {
    baseURL:
      // process.env.REACT_APP_CUSTOM_HOSTNAME === 'true'
      //   ? window.location.origin:
      process.env.REACT_APP_API_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  }
  setToken = () => {
    const token = this.browserStorage.getStorage('AUTH')
    if (token) {
      this.config.headers.Authorization = `Bearer ${token}`
    }
  }
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
        // TODO 研究為什麼 return res.data.data 時，data這個變數會被污染
        return res
      },
      (err: any) => {
        if (err.response.status === 404) {
          message.error('404 Not Found')
        } else if (err.response.status === 401) {
          message.error('Unauthorized')
          history.push('/login')
        } else if (err.response && url !== '/auth/login') {
          message.error(err.response.data.message)
        }
        return Promise.reject(err.response.data)
      }
    )
  }
}
export class RestAPI extends ApiEngine {
  request = (method: string, url: string, body: any): Promise<any> => {
    this.setToken()
    this.setInterceptor(url)
    const config = this.config
    config.url = StaticService.apiUrl + url
    config.method = method
    config[method === 'get' ? 'params' : 'data'] = body
    return new Promise((resolve, reject) => {
      this.instance
        .request(config)
        .then((res: any) => {
          resolve(res.data.data)
        })
        .catch((err: any) => {
          reject(err)
        })
    })
  }
}

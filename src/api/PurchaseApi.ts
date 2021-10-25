import { RestAPI } from './engine/axiosRunner'
import moment from 'moment'

export default class PurchaseApi {
  restAPI: any = new RestAPI()
  getPurchases = () => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('get', '/purchase', {})
        .then((res: any) => {
          res.forEach((item: any, index: number) => (item.key = index))
          resolve(res)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
  getPurchaseDetail = (purchase_id: string) => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('get', `/purchase/${purchase_id}`, {})
        .then((res: any) => {
          res.duration_start = moment(res.duration_start)
          res.duration_end = moment(res.duration_end)
          resolve(res)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
  editPurchase = (mode: string, data: any) => {
    // TOCHECK 待確認 format
    // duration_start: moment(dates[0]).toISOString(),
    // duration_end: moment(dates[1]).toISOString()
    // TOCHECK api少這欄
    // course_access:data.course_access,

    const postData =
      mode === 'CREATE'
        ? {
            purchase_number: data.purchase_number,
            company: data.company,
            quata: data.quata,
            duration_start: moment(data.duration_start).format('YYYY/MM/DD'),
            duration_end: moment(data.duration_end).format('YYYY/MM/DD')
          }
        : mode === 'UPDATE'
        ? {
            company: data.company,
            quata: data.quata,
            duration_start: moment(data.duration_start).format('YYYY/MM/DD'),
            duration_end: moment(data.duration_end).format('YYYY/MM/DD'),
            remark: data.remark || ''
          }
        : null

    return new Promise((resolve, reject) => {
      this.restAPI
        .request(
          'post',
          `/purchase${mode === 'UPDATE' ? `/${data.id}` : ''}`,
          postData
        )
        .then(() => {
          resolve(true)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
  deletePurchase = (id: string) => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('delete', `/purchase/${id}`, {})
        .then(() => {
          resolve(true)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
}

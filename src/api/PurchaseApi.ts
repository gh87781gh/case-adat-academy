import { RestAPI } from './engine/axiosRunner'
import { formatDate } from 'utility/format'

export default class PurchaseApi {
  restAPI: any = new RestAPI()
  getPurchases = (data: any) => {
    const query: any = []
    Object.keys(data).forEach((key: string) => {
      if (data[key]) query.push(`${key}=${data[key]}`)
    })

    return new Promise((resolve, reject) => {
      this.restAPI
        .request('get', `/purchase?${query.join('&')}`, {})
        .then((res: any) => {
          res.data.forEach((item: any, index: number) => {
            item.duration_start = formatDate(item.duration_start)
            item.duration_end = formatDate(item.duration_end)
            item.key = index
          })
          resolve(res)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
  getPurchaseDetail = (id: string) => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('get', `/purchase/${id}`, {})
        .then((res: any) => {
          res.data.duration_start = formatDate(res.data.duration_start)
          res.data.duration_end = formatDate(res.data.duration_end)
          resolve(res)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
  getPurchaseRecord = (id: string, page: number) => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request(
          'get',
          `/purchase/${id}/records?${page ? `page=${page}` : ''}`,
          {}
        )
        .then((res: any) => {
          res.data.forEach((item: any, index: number) => {
            item.created_at = formatDate(item.created_at)
            item.key = index
          })
          resolve(res)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
  getPurchaseAccount = (id: string, page: number) => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request(
          'get',
          `/purchase/${id}/accounts?${page ? `page=${page}` : ''}`,
          {}
        )
        .then((res: any) => {
          res.data.forEach((item: any, index: number) => (item.key = index))
          resolve(res)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
  editPurchase = (mode: string, data: any) => {
    const postData =
      mode === 'CREATE'
        ? {
            purchase_number: data.purchase_number,
            company: data.company,
            quata: data.quata,
            // course_access: data.course_access.join(','), //TOCHECK
            duration_start: formatDate(data.duration_start),
            duration_end: formatDate(data.duration_end)
          }
        : mode === 'UPDATE'
        ? {
            company: data.company,
            quata: data.quata,
            // course_access: data.course_access.join(','), //TOCHECK
            duration_start: formatDate(data.duration_start),
            duration_end: formatDate(data.duration_end),
            remark: data.remark ?? ''
          }
        : null

    return this.restAPI.request(
      'post',
      `/purchase${mode === 'UPDATE' ? `/${data.id}` : ''}`,
      postData
    )
  }
  deletePurchase = (id: string) => {
    return this.restAPI.request('delete', `/purchase/${id}`, {})
  }
  createPurchaseAccount = (id: string, data: any) => {
    return this.restAPI.request('post', `/purchase/${id}/accounts`, data)
  }
}

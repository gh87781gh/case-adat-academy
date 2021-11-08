import { RestAPI } from './engine/axiosRunner'

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
  getPurchaseDetail = (id: string) => {
    return this.restAPI.request('get', `/purchase/${id}`, {})
  }
  getPurchaseRecord = (id: string) => {
    return this.restAPI.request('get', `/purchase/${id}/records`, {})
  }
  getPurchaseAccount = (id: string) => {
    return new Promise((resolve, reject) => {
      this.restAPI
        .request('get', `/purchase/${id}/accounts`, {})
        .then((res: any) => {
          res.forEach((item: any, index: number) => (item.key = index))
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
            duration_start: data.duration_start,
            duration_end: data.duration_end
          }
        : mode === 'UPDATE'
        ? {
            company: data.company,
            quata: data.quata,
            // course_access: data.course_access.join(','), //TOCHECK
            duration_start: data.duration_start,
            duration_end: data.duration_end,
            remark: data.remark || ''
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

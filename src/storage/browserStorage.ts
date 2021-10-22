// Keep data when window reload.
export default class BrowserStorage {
  // LOGIN_USERNAME
  setStorage(key: string, val: any) {
    sessionStorage.setItem(key, val)
  }
  getStorage(key: string) {
    return sessionStorage.getItem(key)
  }
  removeStorage(key: string) {
    sessionStorage.removeItem(key)
  }

  // getToken() {
  //   const token = SessionStorage.getItem('TOKEN')
  //   if (!token) {
  //     console.warn('Token is not found.')
  //   }
  //   return token
  // }
}

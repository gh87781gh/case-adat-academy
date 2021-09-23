import React from 'react'

// Use when: globally and updated very often
// Context is all set in the Highest-level-component "LayoutTemplate" for making it globally.
interface IContext {
  // profile: any
  setIsLoading: any
}
export const MyContext = React.createContext<IContext>({
  // profile: {},
  setIsLoading: (spinning: boolean) => {}
})

// Globally but updated only once time
export class StaticService {
  static apiUrl: string = `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_VERSION}`
  static tablePageSize: number = 15
  static deviceType: { A: string; B: string } = {
    A: 'textA',
    B: 'textB'
  }
}

// Keep data when window reload.
export class BrowserStorage {
  setLoginUsername(val: string) {
    sessionStorage.setItem('LOGIN_USERNAME', val)
  }
  getLoginUsername() {
    return sessionStorage.getItem('LOGIN_USERNAME')
  }
  removeLoginUsername() {
    sessionStorage.removeItem('LOGIN_USERNAME')
  }

  // getToken() {
  //   const token = SessionStorage.getItem('TOKEN')
  //   if (!token) {
  //     console.warn('Token is not found.')
  //   }
  //   return token
  // }
}

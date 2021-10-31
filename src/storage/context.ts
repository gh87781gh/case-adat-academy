// Use when: globally and updated very often
// Context is all set in the Highest-level-component "LayoutTemplate" for making it globally.
import React from 'react'

interface IContext {
  auth: any
  setIsLoading: any
  getAuth: any
}
const MyContext = React.createContext<IContext>({
  auth: {},
  setIsLoading: (spinning: boolean) => {},
  getAuth: () => {}
})
export default MyContext

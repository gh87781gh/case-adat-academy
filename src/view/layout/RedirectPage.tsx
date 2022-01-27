import { useEffect, useContext } from 'react'
import { useHistory, useParams, useLocation } from 'react-router-dom'
import { MyContext, BrowserStorage } from 'storage'
import LoginApi from 'api/LoginApi'

const RedirectPage = () => {
  const context = useContext(MyContext)
  const api = new LoginApi()
  const browserStorage = new BrowserStorage()
  const history = useHistory()
  const location = useLocation()
  const { target, verify } = useParams<{ target: string; verify: string }>()

  useEffect(() => {
    console.log('location:', location)
    if (target && verify) {
      console.log('導向:', target, verify)
      switch (target) {
        case 'course-signUp':
          api
            .signUpEmailVerify(verify)
            .then((res: any) => {
              browserStorage.setStorage('AUTH', res.data.token)
              history.push('/course')
            })
            .catch(() => history.push('/login'))
          break
        case 'passwordRecover3':
          api
            .recoverPasswordVerify(verify)
            .then((res: any) => {
              history.push({
                pathname: '/login/passwordRecover3',
                state: {
                  tempPassword: res.data.key
                }
              })
            })
            .finally(() => context.setIsLoading(false))
          break
      }
    }
  }, [target, verify]) // eslint-disable-line react-hooks/exhaustive-deps

  return <>Redirecting...</>
}
export default RedirectPage

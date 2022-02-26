import { useEffect, useContext } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { MyContext, BrowserStorage } from 'storage'
import LoginApi from 'api/LoginApi'

const RedirectPage = () => {
  const context = useContext(MyContext)
  const api = new LoginApi()
  const browserStorage = new BrowserStorage()
  const history = useHistory()
  const { target, verify } = useParams<{ target: string; verify: string }>()

  useEffect(() => {
    if (target && verify) {
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
          context.setIsLoading(true)
          api
            .recoverPasswordVerify(verify)
            .then((res: any) => {
              history.push({
                pathname: '/login/passwordRecover3',
                state: {
                  key: res.data.key
                }
              })
            })
            .catch(() => history.push('/login'))
            .finally(() => context.setIsLoading(false))
          break
      }
    }
  }, [target, verify]) // eslint-disable-line react-hooks/exhaustive-deps

  return <>Redirecting...</>
}
export default RedirectPage

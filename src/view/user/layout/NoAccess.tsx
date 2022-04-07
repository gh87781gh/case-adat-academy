import Header from 'view/user/layout/Header'
import Footer from 'view/user/layout/Footer'
import { Btn } from 'utility/component'

const NoAccess = () => {
  return (
    <>
      <Header />
      <article className='aa-layout-container aa-layout-container-prompt'>
        <div className=' aa-layout-container-prompt-content'>
          <h1 className='aa-title'>Oops</h1>
          <p>
            It seems that you hace no access to the page. Please visit help
            center for more information.
          </p>
          <Btn feature='primary'>Go to help center</Btn>
        </div>
      </article>
      <Footer />
    </>
  )
}
export default NoAccess

import Header from 'view/Header'
import Footer from 'view/user/layout/Footer'
import { Btn } from 'utility/component'

const NoAccess = () => {
  return (
    <>
      <Header />
      <article className='ad-layout-container ad-layout-container-prompt'>
        <div className=' ad-layout-container-prompt-content'>
          <h1 className='ad-title'>Oops</h1>
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

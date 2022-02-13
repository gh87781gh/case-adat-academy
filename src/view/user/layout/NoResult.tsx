import { useHistory } from 'react-router-dom'

import Header from 'view/user/layout/Header'
import Footer from 'view/user/layout/Footer'

import { Btn } from 'utility/component'

const NoResult = () => {
  const history = useHistory()

  return (
    <>
      <Header />
      <article className='ad-layout-container ad-layout-container-prompt'>
        <div className=' ad-layout-container-prompt-content'>
          <h1 className='ad-title'>No results.</h1>
          <p>
            Can’t find solutions? Please visit help center, and contact us for
            more information
          </p>

          <Btn feature='primary' onClick={() => history.push('/helpCenter')}>
            Go to help center
          </Btn>
        </div>
      </article>
      <Footer />
    </>
  )
}
export default NoResult

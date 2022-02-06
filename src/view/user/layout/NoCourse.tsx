import { useHistory } from 'react-router-dom'

import { Btn } from 'utility/component'

const NoCourse = () => {
  const history = useHistory()

  return (
    <div className='ad-layout-container ad-layout-container-prompt no-course'>
      <div className=' ad-layout-container-prompt-content'>
        <h1 className='ad-title'>No available courses</h1>
        <p>
          It seems that you hace no available course. Contact us for more
          information in help center.
        </p>
        <Btn feature='primary' onClick={() => history.push('/helpCenter')}>
          Go to help center
        </Btn>
      </div>
    </div>
  )
}
export default NoCourse

import { useHistory } from 'react-router-dom'
import { Button } from 'antd'

const TermsPrivacy = () => {
  const history = useHistory()
  return (
    <>
      <div className='ad-login-content-header'>
        <Button className='ad-mb-1' onClick={() => history.push('/')}>
          Back
        </Button>
        <h1>Terms & privacy</h1>
      </div>
      <div className='ad-login-content-body'>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati
          ullam tempore ex cum cumque repellendus. Voluptatem distinctio odio
          accusantium velit qui delectus placeat consequatur quo. Earum, at
          quibusdam. Velit, culpa. Eaque ipsam itaque veritatis at sunt
          necessitatibus corrupti, porro similique inventore quos vel
          accusantium blanditiis saepe esse voluptatibus aliquam recusandae est
          quod quae provident minima. In rem odit necessitatibus vitae! Ipsum
          quaerat tempora reprehenderit voluptatibus odio atque nisi quia.
          Deleniti, praesentium? Ipsa cupiditate autem molestias nisi modi
          repellendus, voluptatibus quibusdam odit officia numquam saepe magni,
          placeat fuga inventore expedita at. Omnis ullam velit officiis a atque
          exercitationem iure aspernatur. Nobis enim recusandae aspernatur
          laborum iste sequi tempora debitis itaque praesentium? Dolores officia
          consequatur perferendis quos veritatis natus perspiciatis ratione.
          Deserunt! Hic facilis cumque qui fugiat suscipit mollitia numquam
          incidunt unde ipsa, quo itaque delectus sit? Quisquam iste cumque
          facere id dolor, consequatur saepe, explicabo consequuntur voluptas
          natus quibusdam? Ad, amet. Sequi obcaecati facilis, illo animi vero,
          soluta ratione impedit fugiat accusamus eos eum quae minus error
          debitis ipsa. Eos, tenetur delectus animi fugiat a reiciendis in nemo
          fugit aliquam sint?
        </p>
      </div>
    </>
  )
}
export default TermsPrivacy

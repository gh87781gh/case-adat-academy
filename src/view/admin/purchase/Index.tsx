import { useState } from 'react'
import Header from '../../Header'
import Purchase from './Purchase'
import PurchaseAccount from './PurchaseAccount'
import AdminSideBar from '../AdminSideBar'

const Index = () => {
  const [step, setStep] = useState<number>(0)
  const [purchaseId, setPurchaseId] = useState<string>('')

  return (
    <>
      <Header />
      <div className='ad-layout-admin'>
        <AdminSideBar />
        <article>
          {step === 0 ? (
            <Purchase
              next={() => setStep(1)}
              purchaseId={purchaseId}
              setPurchaseId={(id: string) => setPurchaseId(id)}
            />
          ) : (
            <PurchaseAccount
              prev={() => setStep(0)}
              purchaseId={purchaseId}
              setPurchaseId={(id: string) => setPurchaseId(id)}
            />
          )}
        </article>
      </div>
    </>
  )
}
export default Index

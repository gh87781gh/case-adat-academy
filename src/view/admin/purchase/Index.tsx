import { useState } from 'react'
import Purchase from './Purchase'
import PurchaseAccount from './PurchaseAccount'

const Index = () => {
  const [step, setStep] = useState<number>(0)
  const [purchaseId, setPurchaseId] = useState<string>('')

  return (
    <>
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
    </>
  )
}
export default Index

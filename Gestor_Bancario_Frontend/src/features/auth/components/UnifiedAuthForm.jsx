import { MODE, useUnifiedAuth } from '../hooks/useUnifiedAuth.js'
import { LoginMode } from './LoginMode.jsx'
import { RegisterMode } from './RegisterMode.jsx'
import { ForgotPasswordMode } from './ForgotPasswordMode.jsx'
import { ResendMode } from './ResendMode.jsx'
import { WaitingVerification } from './WaitingVerification.jsx'

export const UnifiedAuthForm = ({ onRegistered, initialMode = MODE.LOGIN, onlyRegister = false, dynamic = false } = {}) => {
  const auth = useUnifiedAuth({ initialMode, onRegistered })

  if (onlyRegister) {
    return (
      <div className="mx-auto w-full max-w-[540px]">
        <RegisterMode auth={auth} dynamic={dynamic} />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[480px]">
      {auth.mode === MODE.LOGIN && <LoginMode auth={auth} />}
      {auth.mode === MODE.REGISTER && <RegisterMode auth={auth} dynamic={dynamic} />}
      {auth.mode === MODE.FORGOT_PASSWORD && <ForgotPasswordMode auth={auth} />}
      {auth.mode === MODE.RESEND_VERIFICATION && <ResendMode auth={auth} />}
      {auth.mode === MODE.WAITING_VERIFICATION && <WaitingVerification auth={auth} />}
    </div>
  )
}

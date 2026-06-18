import { AuthBackdrop } from '../components/AuthBackdrop.jsx'
import { AuthShowcasePanel } from '../components/AuthShowcasePanel.jsx'
import { ResetPasswordForm } from '../components/ResetPasswordForm.jsx'

export const ResetPasswordPage = () => (
  <main className="relative min-h-screen overflow-hidden bg-black text-white">
    <AuthBackdrop />

    <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-[1600px] lg:grid-cols-[1.05fr_0.95fr]">
      <AuthShowcasePanel />
      <ResetPasswordForm />
    </div>
  </main>
)

import { NavLink } from 'react-router-dom'
import {
  Home,
  CreditCard,
  ArrowRightLeft,
  Heart
} from 'lucide-react'

import { AvatarUser } from '../ui/AvatarUser'

export const ClientNavbar = () => {
  const getNavLinkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${isActive
      ? 'bg-white text-black'
      : 'text-white/70 hover:text-white hover:bg-white/8'
    }`

  return (
    <header className="relative z-50 flex items-center justify-between px-6 py-3 mb-5"
      style={{
        backgroundColor: '#111111',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* LOGO */}
      <div className="flex items-center">
        <h1 className="text-xl font-black tracking-widest text-white">
          KINAL BANC
        </h1>
      </div>

      {/* NAV */}
      <nav className="hidden lg:flex items-center gap-1">
        <NavLink to="/client" end className={getNavLinkClass}>
          <Home size={16} />
          Inicio
        </NavLink>

        <NavLink to="/client/accounts" className={getNavLinkClass}>
          <CreditCard size={16} />
          Mis cuentas
        </NavLink>

        <NavLink to="/client/transfers" className={getNavLinkClass}>
          <ArrowRightLeft size={16} />
          Transferencias
        </NavLink>

        <NavLink to="/client/favoritos" className={getNavLinkClass}>
          <Heart size={16} />
          Favoritos
        </NavLink>

      </nav>

      {/* USER */}
      <AvatarUser />
    </header>
  )
}
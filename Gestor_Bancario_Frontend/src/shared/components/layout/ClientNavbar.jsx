import { NavLink } from 'react-router-dom'
import {
  Home,
  CreditCard,
  ArrowRightLeft,
  Heart,
  Package,
  Tag,
  Sun,
  Moon,
  TrendingUp
} from 'lucide-react'


import { AvatarUser } from '../ui/AvatarUser'
import { useTheme } from '../../store/themeStore.js'

export const ClientNavbar = () => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  const getNavLinkClass = ({ isActive }) => {
    if (isActive) {
      return isDark
        ? 'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 bg-white text-black'
        : 'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 bg-[#1a56db] text-white'
    }

    return isDark
      ? 'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 text-white/70 hover:text-white hover:bg-white/8'
      : 'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
  }

  return (
    <header className="relative z-50 flex items-center justify-between px-6 py-3 mb-5"
      style={{
        backgroundColor: 'var(--theme-surface)',
        borderRadius: '16px',
        border: '1px solid var(--theme-border)',
      }}
    >
      {/* LOGO */}
      <div className="flex items-center">
        <h1 className="text-xl font-black tracking-widest text-[var(--theme-text)]">
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

        <NavLink to="/client/transacciones" className={getNavLinkClass}>
          <ArrowRightLeft size={16} />
          Transacciones
        </NavLink>

        <NavLink to="/client/favoritos" className={getNavLinkClass}>
          <Heart size={16} />
          Favoritos
        </NavLink>

        <NavLink to="/client/servicios" className={getNavLinkClass}>
          <Package size={16} />
          Servicios
        </NavLink>

        <NavLink to="/client/promociones" className={getNavLinkClass}>
          <Tag size={16} />
          Promociones
        </NavLink>

        <NavLink to="/client/divisas" className={getNavLinkClass}>
          <TrendingUp size={16} />
          Divisas
        </NavLink>


      </nav>

      {/* USER */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          className={isDark
            ? 'inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white transition hover:bg-white/20'
            : 'inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100'
          }
          aria-label="Cambiar tema"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <AvatarUser />
      </div>
    </header>
  )
}
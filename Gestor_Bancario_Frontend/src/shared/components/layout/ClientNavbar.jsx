import { Link } from 'react-router-dom'
import {
  Home,
  CreditCard,
  ArrowRightLeft,
  CircleHelp,
  Heart
} from 'lucide-react'

import { AvatarUser } from '../ui/AvatarUser'

export function ClientNavbar() {
  return (
    <header className="relative z-50 rounded-[2rem] border border-white/10 bg-[#081028]/90 backdrop-blur-xl px-8 py-5 flex items-center justify-between shadow-2xl">
      {/* LOGO */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-wide">
            KINAL BANC
          </h1>
        </div>
      </div>

      {/* NAV */}
      <nav className="hidden lg:flex items-center gap-3">
        <Link
          to="/client"
          className="flex items-center gap-2 rounded-2xl bg-blue-500/20 border border-blue-400/20 px-5 py-3 text-blue-300 transition"
        >
          <Home size={20} />
          Inicio
        </Link>

        <Link
          to="/client/accounts"
          className="flex items-center gap-2 rounded-2xl px-5 py-3 hover:bg-white/5 transition"
        >
          <CreditCard size={20} />
          Mis cuentas
        </Link>

        <Link
          to="/client/transfers"
          className="flex items-center gap-2 rounded-2xl px-5 py-3 hover:bg-white/5 transition"
        >
          <ArrowRightLeft size={20} />
          Transferencias
        </Link>

        <Link
          to="/client/favoritos"
          className="flex items-center gap-2 rounded-2xl px-5 py-3 hover:bg-white/5 transition"
        >
          <Heart size={20} />
          Favoritos
        </Link>

        <Link
          to="/client/ayuda"
          className="flex items-center gap-2 rounded-2xl px-5 py-3 hover:bg-white/5 transition"
        >
          <CircleHelp size={20} />
          Ayuda
        </Link>
      </nav>

      {/* USER */}
      <AvatarUser />
    </header>
  )
}
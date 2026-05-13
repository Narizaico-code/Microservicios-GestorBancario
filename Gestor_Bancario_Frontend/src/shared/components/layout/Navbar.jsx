import { Link, useLocation } from "react-router-dom"
import imgLogo from "../../../assets/IMGLogoSinLetra.png"
import { AvatarUser } from "../ui/AvatarUser"

export const Navbar = () => {
    const location = useLocation()

    const items = [
        { label: "Cuentas", to: "/dashboard/cuentas" },
        { label: "Usuarios", to: "/dashboard/usuarios" },
        { label: "Ayuda", to: "/dashboard/ayuda" },
    ]

    return (
        <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[linear-gradient(90deg,_#02183f_0%,_#07306a_48%,_#0b4b8f_100%)] shadow-[0_10px_30px_rgba(2,24,63,0.32)] backdrop-blur-xl">
            <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8 md:h-24">
                <Link to="/dashboard" className="flex items-center gap-3 whitespace-nowrap">
                    <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white/10 ring-1 ring-white/15">
                        <img
                            src={imgLogo}
                            alt="KINAL BANC"
                            className="h-full w-full object-cover"
                        />
                    </span>
                    <span className="text-lg font-extrabold tracking-wide text-white sm:text-xl">
                        KINAL BANC
                    </span>
                </Link>

                <ul className="hidden flex-1 items-center justify-center gap-3 lg:flex">
                    {items.map((item) => {
                        const active = location.pathname.startsWith(item.to)

                        return (
                            <li key={item.to}>
                                <Link
                                    to={item.to}
                                    className={`inline-flex items-center rounded-2xl px-5 py-3 text-sm font-semibold transition duration-200 ${active
                                        ? 'bg-white/14 text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] ring-1 ring-white/15'
                                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        )
                    })}
                </ul>

                <div className="ml-auto flex items-center gap-3">
                    <AvatarUser />
                </div>
            </div>
        </nav>
    )
}

import { Typography } from "@material-tailwind/react"
import { Link, useLocation } from "react-router-dom"
import imgLogo from "../../../assets/IMGLogoSinLetra.png"
import { AvatarUser } from "../ui/AvatarUser"

export const Navbar = () => {
    const location = useLocation();


    const items = [
        { label: "Cuentas", to: "/dashboard/cuentas" },
        { label: "Perfil", to: "/dashboard/perfil" },
        { label: "Ayuda", to: "/dashboard/ayuda" },
    ]
    return (
        <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-12 w-12 md:h-16 md:w-16 rounded-full overflow-hidden flex-shrink-0">
                        <img
                            src={imgLogo}
                            alt="KINAL BANC Logo"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <Typography variant="h5" className="font-bold text-main-blue text-lg md:text-2xl">
                        KINAL BANC
                    </Typography>
                </div>

                <div>
                    {/* secondary dark nav (like the attached image) */}
                    <div >
                        <div className="max-w-7xl mx-auto px-6">
                            <ul className="flex items-center justify-end gap-8 h-12 md:h-14">
                                {items.map((item) => {
                                    const active = location.pathname.startsWith(item.to);

                                    return (
                                        <li key={item.to}>
                                            <Link
                                                to={item.to}
                                                className={`block px-4 py-2 rounded-lg font-medium border-b-2 transition-all duration-200 ${active
                                                    ? 'text-main-blue border-main-blue'
                                                    : 'text-gray-700 border-transparent hover:text-white hover:bg-[#0b3a63]'
                                                    }`}
                                            >
                                                {item.label}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>

                <AvatarUser />         

            </div>
        </nav>
    )
}

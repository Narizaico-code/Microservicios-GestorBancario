import { Typography } from "@material-tailwind/react"
import { Link, useLocation } from "react-router-dom"
import imgLogo from "../../../assets/IMGLogoSinLetra.png"


export const Navbar = () => {
    const location = useLocation();


    const items = [

        { label: "Cuentas", to: "/dashboard/cuentas" },
        { label: "Perfil", to: "/dashboard/perfil" },
        { label: "Ayuda", to: "/dashboard/ayuda" },
        { label: "Cerrar Sesión", to: "/auth" }
    ]
    return (
        <nav className="bg-white shadow-md sticky top-0 z-10">
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
                                    const isLogout = item.label === "Cerrar Sesión";

                                    return (
                                        <li key={item.to}>
                                            <Link
                                                to={item.to}
                                                className={`block px-4 py-2 rounded-lg font-medium border-b-2 transition-all duration-200 ${isLogout
                                                        ? 'text-red-600 border-transparent hover:bg-red-600 hover:text-white'
                                                        : active
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



            </div>
        </nav>
    )
}

import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../../features/auth/store/authStore";
import defaultAvatarImg from "../../../assets/DefaultAvatarUser.png"

export const AvatarUser = () => {
    const { session, logout } = useAuthStore();
    const user = session?.user;
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const navigate = useNavigate();

    const toogleMenu = () => setOpen((prev) => !prev)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    };

    

    const avatarSrc = user?.profilePicture && user.profilePicture.trim() !== "" ? user.profilePicture : defaultAvatarImg;
    const userName = user?.name || user?.username || "Usuario";

    return (
        <div
            className="relative z-[9999]"
            ref={dropdownRef}
        >
            <img
                src={avatarSrc}
                alt={userName}
                className="h-12 w-12 cursor-pointer rounded-full object-cover ring-2 ring-white/25 transition-opacity hover:opacity-80"
                onClick={toogleMenu}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultAvatarImg;
                }}
            />

            {open && (
                <div className="absolute right-0 top-14 z-[9999] w-56 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl shadow-slate-950/50 backdrop-blur-xl animate-fadeIn">
                    <div className="border-b border-white/10 px-4 py-3">
                        <p className="font-semibold text-white">{userName}</p>
                        <p className="truncate text-sm text-slate-300">{user?.email}</p>
                    </div>
                    <ul className="p-2 text-sm font-medium text-white">

                        <li>
                            <Link
                                to={user?.role === 'ADMIN_ROLE' ? '/dashboard/perfil' : '/client/perfil'}
                                className="block w-full rounded-xl px-3 py-2 transition hover:bg-white/10"
                            >
                                Perfil
                            </Link>
                        </li>

                        <li>
                            <button
                                onClick={handleLogout}
                                className="block w-full rounded-xl px-3 py-2 text-left text-rose-300 transition hover:bg-rose-500/10 hover:text-rose-200"
                            >
                                Cerrar sesión
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    )


}
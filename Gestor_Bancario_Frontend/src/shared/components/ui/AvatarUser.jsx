import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../../features/auth/store/authStore";
import defaultAvatarImg from "../../../assets/DefaultAvatarUser.png"

export const AvatarUser = () => {
    const { user, logout } = useAuthStore();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const navigate = useNavigate();

    const toogleMenu = () => setOpen((prev) => !prev);

    useEffect(() => {
    console.log("USER:", user);
}, [user]);

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

    return (
        <div
            className="relative"
            ref={dropdownRef}>
            <img src={avatarSrc}
                alt={user?.username}
                className="w-13 h-13 rounded-full object-cover border cursor-pointer"
                onClick={toogleMenu}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultAvatarImg;
                }}
            />

            {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg animate-fadeIn z-50">
                    <div className="px-4 py-3 border-b">
                        <p className="font-semibold text-gray-800"> {user?.username} </p>
                        <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <ul className="p-2 text-sm text-gray-700 font-medium">
                        <li>
                            <Link to="/dashboard" className="block w-full p-2 rounded-md hover:bg-gray-100">
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard/cuentas" className="block w-full p-2 rounded-md hover:bg-gray-100">
                                Cuentas
                            </Link>
                        </li>

                        <li>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left p-2 rounded-md hover:bg-red-100 text-red-600"
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
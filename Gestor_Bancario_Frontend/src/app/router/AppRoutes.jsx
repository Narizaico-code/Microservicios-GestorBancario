import { Routes, Route } from "react-router-dom"
import { DashboardPage } from "../layouts/DashboardPages.jsx"
import { Accounts } from "../../features/account/components/Accounts.jsx"


export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="cuentas" element={<Accounts />} />
        </Routes>
    )
}
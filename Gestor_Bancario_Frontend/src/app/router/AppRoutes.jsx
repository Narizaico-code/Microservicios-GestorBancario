import { Routes, Route } from "react-router-dom"
import { DashboardPage } from "../layouts/DashboardPages.jsx"


export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<DashboardPage />} />
        </Routes>
    )
}
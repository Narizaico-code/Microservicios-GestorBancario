import { Navbar } from "./Navbar"

export const DashboardContainer = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex flex-1">
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>  
    )
}

import { Navbar } from "./Navbar"

export const DashboardContainer = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
            <Navbar />
            <div className="flex flex-1 overflow-hidden pt-20 md:pt-24">
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>  
    )
}

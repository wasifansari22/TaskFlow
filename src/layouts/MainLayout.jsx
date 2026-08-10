import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function MainLayout() {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <div className="flex min-w-0 flex-1 flex-col">
                <Navbar />

                <main className="flex-1 overflow-auto p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default MainLayout;
import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BackToTopButton from "../components/ui/BackToTopButton";

const MainLayout = () => {
    const location = useLocation();
    const mainRef = useRef(null);

    useEffect(() => {
        mainRef.current?.scrollTo({
            top: 0,
            behavior: "auto",
        });
    }, [location.pathname]);

    return (
        <div className="flex h-screen overflow-hidden bg-[#f5f6f8] text-slate-900 dark:bg-[#0b0d11] dark:text-slate-100">
            <Sidebar />

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <Navbar />

                <main
                    ref={mainRef}
                    className="min-h-0 flex-1 overflow-auto px-5 py-6 sm:px-7 lg:px-9 xl:px-10"
                >
                    <div key={location.pathname} className="page-enter">
                        <Outlet />
                    </div>
                </main>

                <BackToTopButton scrollContainerRef={mainRef} />
            </div>
        </div>
    );
}

export default MainLayout;
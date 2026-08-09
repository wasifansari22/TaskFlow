import { Link, Outlet } from "react-router";

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            <header className="border-b border-slate-200 bg-white">
                <div className="flex h-16 items-center justify-between px-6">
                    <h1 className="text-xl font-bold text-slate-900">
                        TaskFlow
                    </h1>

                    <nav className="flex items-center gap-6 text-sm">
                        <Link
                            to="/"
                            className="text-slate-600 transition hover:text-blue-600"
                        >
                            Dashboard
                        </Link>

                        <Link
                            to="/projects"
                            className="text-slate-600 transition hover:text-blue-600"
                        >
                            Projects
                        </Link>

                        <Link
                            to="/tasks"
                            className="text-slate-600 transition hover:text-blue-600"
                        >
                            Tasks
                        </Link>

                        <Link
                            to="/settings"
                            className="text-slate-600 transition hover:text-blue-600"
                        >
                            Settings
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="p-6">
                <Outlet />
            </main>
        </div>
    );
}

export default MainLayout;
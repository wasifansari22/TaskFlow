import { NavLink } from "react-router";
import { mainNavigation, secondaryNavigation, } from "../constants/navigation";

function Sidebar() {
    return (
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
            <div className="flex h-20 items-center border-b border-slate-200 px-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-sm">
                        T
                    </div>

                    <div>
                        <h1 className="text-lg font-bold leading-tight tracking-tight text-slate-900">
                            TaskFlow
                        </h1>

                        <p className="mt-0.5 text-xs text-slate-500">
                            Work smarter
                        </p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 space-y-1 p-4">
                {mainNavigation.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive
                                ? "bg-blue-50 text-blue-700"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            }`
                        }
                    >
                        {item.name}
                    </NavLink>
                ))}

                <div className="my-4 border-t border-slate-200" />

                {secondaryNavigation.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive
                                ? "bg-blue-50 text-blue-700"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            }`
                        }
                    >
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            <div className="border-t border-slate-200 p-4">
                <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-sm font-medium text-slate-900">
                        TaskFlow
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        Stay organized. Get things done.
                    </p>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
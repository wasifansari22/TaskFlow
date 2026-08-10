import { useState } from "react";
import { NavLink } from "react-router";
import { mainNavigation, secondaryNavigation } from "../constants/navigation";

const navigation = [
  ...mainNavigation,
  ...secondaryNavigation,
];

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <header className="relative flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen((previous) => !previous)}
                        className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
                        aria-label="Toggle navigation menu"
                        aria-expanded={isMenuOpen}
                    >
                        <span className="text-xl">
                            {isMenuOpen ? "✕" : "☰"}
                        </span>
                    </button>

                    <div>
                        <h2 className="text-sm font-semibold text-slate-900">
                            Workspace
                        </h2>

                        <p className="hidden text-xs text-slate-500 sm:block">
                            Personal workspace
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                    <button
                        type="button"
                        className="relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        aria-label="Notifications"
                    >
                        <span className="text-lg">🔔</span>

                        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-600" />
                    </button>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                        WA
                    </div>

                    <div className="hidden sm:block">
                        <p className="text-sm font-medium text-slate-900">
                            Wasif
                        </p>

                        <p className="text-xs text-slate-500">
                            Developer
                        </p>
                    </div>
                </div>
            </header>

            {isMenuOpen && (
                <div className="border-b border-slate-200 bg-white p-4 lg:hidden">
                    <nav className="space-y-1">
                        {navigation.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={({ isActive }) =>
                                    `block rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    }`
                                }
                            >
                                {item.name}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            )}
        </>
    );
}

export default Navbar;
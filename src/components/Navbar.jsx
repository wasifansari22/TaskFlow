import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router";
import { mainNavigation, secondaryNavigation } from "../constants/navigation";
import { selectUnreadNotificationCount } from "../features/notifications/notificationSelectors";
import NotificationPanel from "../features/notifications/components/NotificationPanel";
import { logout } from "../features/auth/authSlice";
import { selectCurrentUser } from "../features/auth/authSelectors";

const navigation = [
    ...mainNavigation,
    ...secondaryNavigation,
];

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const unreadCount = useSelector(selectUnreadNotificationCount);
    const currentUser = useSelector(selectCurrentUser);

    const notificationRef = useRef(null);
    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setIsNotificationOpen(false);
            }
            if (
                profileRef.current && !profileRef.current.contains(event.target)
            ) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        setIsProfileOpen(false);
        navigate("/login", { replace: true });
    }

    // Lock body scroll while it's open
    useEffect(() => {
        if (isNotificationOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isNotificationOpen]);

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
                    <div ref={notificationRef} className="relative">
                        <button
                            type="button"
                            onClick={() =>
                                setIsNotificationOpen((previous) => !previous)
                            }
                            className="relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                            aria-label="Notifications"
                            aria-expanded={isNotificationOpen}
                            aria-haspopup="dialog"
                        >
                            <span className="text-lg">🔔</span>
                            {unreadCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}
                        </button>

                        {isNotificationOpen && (
                            <NotificationPanel
                                onClose={() => setIsNotificationOpen(false)}
                            />
                        )}
                    </div>

                    {/* Navbar Profile Section */}
                    <div ref={profileRef} className="relative">
                        <button
                            type="button"
                            onClick={() =>
                                setIsProfileOpen((previous) => !previous)
                            }
                            className="flex items-center gap-3 rounded-lg p-1.5 transition hover:bg-slate-50"
                            aria-label="Open profile menu"
                            aria-expanded={isProfileOpen}
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                                {currentUser?.name
                                    ? currentUser.name
                                        .split(" ")
                                        .map((name) => name[0])
                                        .join("")
                                        .slice(0, 2)
                                        .toUpperCase()
                                    : "U"}
                            </div>

                            <div className="hidden text-left sm:block">
                                <p className="text-sm font-medium text-slate-900">
                                    {currentUser?.name || "User"}
                                </p>

                                <p className="text-xs text-slate-500">
                                    Developer
                                </p>
                            </div>
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                                <div className="border-b border-slate-100 px-3 py-3">
                                    <p className="text-sm font-semibold text-slate-900">
                                        {currentUser?.name || "User"}
                                    </p>

                                    <p className="mt-1 truncate text-xs text-slate-500">
                                        {currentUser?.email || ""}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="mt-1 w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                                >
                                    Log out
                                </button>
                            </div>
                        )}
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
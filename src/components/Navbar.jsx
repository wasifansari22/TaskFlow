import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router";
import { Bell } from "lucide-react";
import { mainNavigation, secondaryNavigation } from "../constants/navigation";
import { selectUnreadNotificationCount } from "../features/notifications/notificationSelectors";
import { fetchNotificationsAsync, getNotificationOwnerKey } from "../features/notifications/notificationSlice";
import NotificationPanel from "../features/notifications/components/NotificationPanel";
import { logout } from "../features/auth/authSlice";
import { selectCurrentUser } from "../features/auth/authSelectors";

const navigation = [...mainNavigation, ...secondaryNavigation];

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const unreadCount = useSelector(selectUnreadNotificationCount);
    const currentUser = useSelector(selectCurrentUser);

    const ownerKey = useSelector((state) =>
        getNotificationOwnerKey(state.auth)
    );

    const notificationRef = useRef(null);
    const notificationButtonRef = useRef(null);
    const profileRef = useRef(null);
    const profileButtonRef = useRef(null);

    // Fetch notification when the authenticated user is available
    useEffect(() => {
        if (ownerKey) {
            dispatch(fetchNotificationsAsync(ownerKey));
        }
    }, [dispatch, ownerKey]);


    useEffect(() => {
        const handleClickOutside = (event) => {
            const clickedElement = event.target;

            if (!(clickedElement instanceof Element)) {
                return;
            }

            // Don't close the panel when interacting with a dialog,
            // such as the Clear All confirmation modal.
            if (clickedElement.closest('[role="dialog"]')) {
                return;
            }

            if (
                notificationRef.current &&
                !notificationRef.current.contains(clickedElement)
            ) {
                setIsNotificationOpen(false);
            }

            if (
                profileRef.current &&
                !profileRef.current.contains(clickedElement)
            ) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener("pointerdown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "pointerdown",
                handleClickOutside
            );
        };
    }, []);


    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key !== "Escape") return;

            if (isNotificationOpen) {
                setIsNotificationOpen(false);
                notificationButtonRef.current?.focus();
                return;
            }

            if (isProfileOpen) {
                setIsProfileOpen(false);
                profileButtonRef.current?.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isNotificationOpen, isProfileOpen]);

    const handleLogout = () => {
        dispatch(logout());
        setIsProfileOpen(false);
        navigate("/login", { replace: true });
    };

    useEffect(() => {
        document.body.style.overflow = isNotificationOpen ? "hidden" : "";

        return () => {
            document.body.style.overflow = "";
        };
    }, [isNotificationOpen]);

    return (
        <>
            <header className="relative flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 transition-colors duration-200 dark:border-slate-700 dark:bg-slate-900 sm:px-6">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen((previous) => !previous)}
                        className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
                        aria-label="Toggle navigation menu"
                        aria-expanded={isMenuOpen}
                    >
                        <span className="text-xl">
                            {isMenuOpen ? "✕" : "☰"}
                        </span>
                    </button>

                    <div>
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            Workspace
                        </h2>
                        <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
                            Personal workspace
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                    <div ref={notificationRef} className="relative">
                        <button
                            ref={notificationButtonRef}
                            type="button"
                            onClick={() =>
                                setIsNotificationOpen((previous) => !previous)
                            }
                            className="relative cursor-pointer rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                            aria-label={
                                unreadCount > 0
                                    ? `Notifications, ${unreadCount} unread`
                                    : "Notifications"
                            }
                            aria-expanded={isNotificationOpen}
                            aria-haspopup="dialog"
                        >
                            <Bell size={20} />

                            {unreadCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}
                        </button>

                        {isNotificationOpen && (
                            <NotificationPanel
                                onClose={() => {
                                    setIsNotificationOpen(false);
                                    notificationButtonRef.current?.focus();
                                }}
                            />
                        )}
                    </div>

                    <div ref={profileRef} className="relative">
                        <button
                            ref={profileButtonRef}
                            type="button"
                            onClick={() =>
                                setIsProfileOpen((previous) => !previous)
                            }
                            className="flex cursor-pointer items-center gap-3 rounded-lg p-1.5 transition hover:bg-slate-50 dark:hover:bg-slate-800"
                            aria-label="Open profile menu"
                            aria-expanded={isProfileOpen}
                            aria-haspopup="menu"
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
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    {currentUser?.name || "User"}
                                </p>

                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Developer
                                </p>
                            </div>
                        </button>

                        {isProfileOpen && (
                            <div
                                role="menu"
                                className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900"
                            >
                                <div className="border-b border-slate-100 px-3 py-3 dark:border-slate-700">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                        {currentUser?.name || "User"}
                                    </p>

                                    <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                                        {currentUser?.email || ""}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={handleLogout}
                                    className="mt-1 w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950 cursor-pointer"
                                >
                                    Log out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {isMenuOpen && (
                <div className="border-b border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 lg:hidden">
                    <Link
                        to="/"
                        onClick={() => setIsMenuOpen(false)}
                        className="mb-4 flex items-center gap-3 rounded-lg px-2 py-2"
                        aria-label="Go to Dashboard"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-sm">
                            T
                        </div>

                        <div>
                            <p className="text-base font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100">
                                TaskFlow
                            </p>

                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                Work smarter
                            </p>
                        </div>
                    </Link>

                    <nav className="space-y-1">
                        {navigation.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={({ isActive }) =>
                                    `block rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive
                                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
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
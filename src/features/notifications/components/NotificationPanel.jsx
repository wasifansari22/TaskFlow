import { useDispatch, useSelector } from "react-redux";
import { CheckCheck, BellOff, } from "lucide-react";
import { selectRecentNotifications, selectUnreadNotificationCount, } from "../notificationSelectors";
import { markAllNotificationAsRead, markNotificationAsRead } from "../notificationSlice";
import NotificationItem from "./NotificationItem";

const NotificationPanel = ({ onClose }) => {
    const dispatch = useDispatch();
    const notifications = useSelector(selectRecentNotifications);
    const unreadCount = useSelector(selectUnreadNotificationCount);

    const handleMarkAsRead = (id) => {
        dispatch(markNotificationAsRead(id));
    };

    const handleMarkAllAsRead = () => {
        dispatch(markAllNotificationAsRead());
    };

    return (
        <div className="fixed inset-x-4 top-16 z-50 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-96">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <div>
                    <h2 className="font-semibold text-slate-900">
                        Notifications
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500">
                        {unreadCount > 0
                            ? `${unreadCount} unread`
                            : "You're all caught up"}
                    </p>
                </div>

                {unreadCount > 0 && (
                    <button
                        type="button"
                        onClick={handleMarkAllAsRead}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-blue-600 transition hover:bg-blue-50"
                    >
                        <CheckCheck size={15} />
                        Mark all read
                    </button>
                )}
            </div>

            {/* Notifications */}
            {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                        <BellOff
                            size={21}
                            className="text-slate-400"
                        />
                    </div>

                    <p className="mt-3 text-sm font-medium text-slate-700">
                        No notifications
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        Activity from your workspace will appear here.
                    </p>
                </div>
            ) : (
                <div className="max-h-105 overflow-y-auto">
                    {notifications.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onRead={handleMarkAsRead}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default NotificationPanel;
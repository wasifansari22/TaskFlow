import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckCheck, BellOff, } from "lucide-react";
import { selectAllNotifications, selectUnreadNotificationCount } from "../notificationSelectors";
import { clearNotifications, deleteNotification, markAllNotificationAsRead, markNotificationAsRead } from "../notificationSlice";
import NotificationItem from "./NotificationItem";
import Modal from "../../../components/ui/Modal";

const NotificationPanel = ({ onClose }) => {
    const dispatch = useDispatch();
    const notifications = useSelector(selectAllNotifications);
    const unreadCount = useSelector(selectUnreadNotificationCount);
    const [isClearModalOpen, setIsClearModalOpen] = useState(false);

    const handleMarkAsRead = (id) => {
        dispatch(markNotificationAsRead(id));
    };

    const handleMarkAllAsRead = () => {
        dispatch(markAllNotificationAsRead());
    };

    const handleDelete = (id) => {
        dispatch(deleteNotification(id));
    };

    const handleConfirmClearAll = () => {
        dispatch(clearNotifications());
        setIsClearModalOpen(false);
    };

    const handleClearAll = () => {
        setIsClearModalOpen(true);
    };

    return (
        <>
            <div className="fixed inset-x-4 top-16 z-50 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-96">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                    <div className="min-w-0">
                        <h2 className="font-semibold text-slate-900">
                            Notifications
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-500">
                            {unreadCount > 0
                                ? `${unreadCount} unread`
                                : "You're all caught up"}
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={handleMarkAllAsRead}
                                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-blue-600 transition hover:bg-blue-50 cursor-pointer"
                            >
                                <CheckCheck size={15} />
                                Mark all read
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={handleClearAll}
                            disabled={notifications.length === 0}
                            className="rounded-lg px-2.5 py-2 text-xs font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                        >
                            Clear all
                        </button>
                    </div>
                </div>

                {/* Notifications */}
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
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
                    <div className="max-h-[min(28rem,calc(100vh-10rem))] overflow-y-auto">
                        {notifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onRead={handleMarkAsRead}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>

            <Modal
                isOpen={isClearModalOpen}
                onClose={() => setIsClearModalOpen(false)}
                title="Clear all notifications"
            >
                <div className="space-y-5">
                    <p className="text-sm leading-6 text-slate-600">
                        Are you sure you want to clear all notifications? This action
                        cannot be undone.
                    </p>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsClearModalOpen(false)}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleConfirmClearAll}
                            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
                        >
                            Clear all
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default NotificationPanel;
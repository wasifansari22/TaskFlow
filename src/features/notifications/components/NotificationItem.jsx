import { CheckCircle2, Circle, FileEdit, Trash2 } from "lucide-react";

const formatRelativeTime = (createdAt) => {
    const createdTime = new Date(createdAt).getTime();
    const currentTime = Date.now();
    const differenceInSeconds = Math.floor(
        (currentTime - createdTime) / 1000
    );

    if (differenceInSeconds < 60) {
        return "Just now";
    }

    const differenceInMinutes = Math.floor(differenceInSeconds / 60);

    if (differenceInMinutes < 60) {
        return `${differenceInMinutes} ${differenceInMinutes === 1 ? "minute" : "minutes"} ago`;
    }

    const differenceInHours = Math.floor(differenceInMinutes / 60);

    if (differenceInHours < 24) {
        return `${differenceInHours} ${differenceInHours === 1 ? "hour" : "hours"} ago`;
    }

    const differenceInDays = Math.floor(differenceInHours / 24);

    if (differenceInDays === 1) {
        return "Yesterday";
    }

    if (differenceInDays < 7) {
        return `${differenceInDays} days ago`;
    }

    return new Date(createdAt).toLocaleDateString([], {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const NotificationItem = ({ notification, onRead, onDelete, onAction }) => {
    const getIcon = () => {
        switch (notification.type) {
            case "task-created":
                return <Circle size={18} className="text-blue-500" />;

            case "task-updated":
                return <FileEdit size={18} className="text-amber-500" />;

            case "task-completed":
                return <CheckCircle2 size={18} className="text-emerald-500" />;

            case "task-deleted":
                return <Trash2 size={18} className="text-rose-500" />;

            default:
                return (
                    <Circle
                        size={18}
                        className="text-slate-400 dark:text-slate-500"
                    />
                );
        }
    };

    const formattedTime = formatRelativeTime(notification.createdAt);

    const handleNotificationClick = () => {
        onRead(notification.id);

        if (onAction) {
            onAction(notification);
        }
    };

    const handleDeleteClick = () => {
        onDelete(notification.id);
    };

    return (
        <div
            className={`border-b border-slate-100 px-4 py-4 transition dark:border-slate-800 ${notification.read
                ? "bg-white dark:bg-slate-900"
                : "border-l-2 border-l-blue-500 bg-blue-50/40 dark:bg-blue-950/30"
                }`}
        >
            <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800">
                    {getIcon()}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <button
                            type="button"
                            onClick={handleNotificationClick}
                            className={`min-w-0 flex-1 cursor-pointer rounded text-left text-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${notification.read
                                ? "font-medium text-slate-700 dark:text-slate-300"
                                : "font-semibold text-slate-900 dark:text-slate-100"
                                }`}
                        >
                            {notification.title}
                        </button>

                        <div className="flex shrink-0 items-center gap-2">
                            {!notification.read && (
                                <span
                                    aria-label="Unread"
                                    className="mt-1 h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400"
                                />
                            )}

                            <button
                                type="button"
                                onClick={handleDeleteClick}
                                className="cursor-pointer rounded-md p-1 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 dark:text-slate-500 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                                aria-label={`Delete ${notification.title}`}
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleNotificationClick}
                        className="mt-1 block w-full cursor-pointer truncate rounded text-left text-sm text-slate-500 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                        {notification.message}
                    </button>

                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                        {formattedTime}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotificationItem;
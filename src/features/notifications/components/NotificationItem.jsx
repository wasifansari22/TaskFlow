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
        return `${differenceInMinutes} ${differenceInMinutes === 1 ? "minute" : "minutes"
            } ago`;
    }

    const differenceInHours = Math.floor(differenceInMinutes / 60);

    if (differenceInHours < 24) {
        return `${differenceInHours} ${differenceInHours === 1 ? "hour" : "hours"
            } ago`;
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
                return <Circle size={18} className="text-blue-500" />

            case "task-updated":
                return <FileEdit size={18} className="text-amber-500" />;

            case "task-completed":
                return <CheckCircle2 size={18} className="text-emerald-500" />;

            case "task-deleted":
                return <Trash2 size={18} className="text-rose-500" />;

            default:
                return <Circle size={18} className="text-slate-400" />;
        }
    };

    const formattedTime = formatRelativeTime(notification.createdAt);

    return (
        <button
            type="button"
            onClick={() => {
                onRead(notification.id);

                if (onAction) {
                    onAction(notification);
                }
            }}
            className={`w-full border-b border-slate-100 px-4 py-4 text-left transition hover:bg-slate-50 ${notification.read
                ? "bg-white"
                : "border-l-2 border-l-blue-500 bg-blue-50/40"
                }`}
        >
            <div className="flex gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50">
                    {getIcon()}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <p className={`text-sm ${notification.read ? "font-medium text-slate-700" : "font-semibold text-slate-900"}`}
                        >
                            {notification.title}
                        </p>

                        <div className="flex shrink-0 items-center gap-2">
                            {!notification.read && (
                                <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
                            )}

                            <span
                                role="button"
                                tabIndex={0}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onDelete(notification.id);
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        onDelete(notification.id);
                                    }
                                }}
                                className="rounded-md p-1 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                                aria-label={`Delete ${notification.title}`}
                            >
                                <Trash2 size={14} />
                            </span>
                        </div>
                    </div>
                    <p className="mt-1 truncate text-sm text-slate-500">{notification.message}</p>
                    <p className="mt-1 text-xs text-slate-400">{formattedTime}</p>
                </div>
            </div>
        </button>
    );
}

export default NotificationItem;
import { CheckCircle2, Circle, FileEdit, Trash2 } from "lucide-react";

const NotificationItem = ({ notification, onRead }) => {
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

    const formattedTime = new Date(notification.createdAt).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    });

    return (
        <button
            type="button"
            onClick={() => onRead(notification.id)}
            className={`w-full border-b border-slate-100 px-4 py-4 text-left transition hover:bg-slate-50 ${notification.read ? "bg-white" : "bg-blue-50/40"
                }`}
        >
            <div className="flex gap-3">
                <div className="mt-0 5 shrink-0">
                    {getIcon()}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <p
                            className={`text-sm ${notification.read ? "font-medium text-slate-700" : "font-semibold text-slate-900"}`}
                        >
                            {notification.title}
                        </p>
                        {!notification.read && (
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                        )}
                    </div>
                    <p className="mt-1 truncate text-sm text-slate-500">{notification.message}</p>
                    <p className="mt-1 text-xs text-slate-400">{formattedTime}</p>
                </div>
            </div>
        </button>
    );
}

export default NotificationItem;
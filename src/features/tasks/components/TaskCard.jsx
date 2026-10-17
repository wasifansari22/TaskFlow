import { CalendarDays, CheckCircle2, Circle, Clock3, Trash2, Pencil } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { deleteTaskAsync, updateTaskStatusAsync } from "../taskSlice";
import { createNotificationAsync, getNotificationOwnerKey, deleteNotificationAsync } from "../../notifications/notificationSlice";
import { selectNotifications } from "../../settings/settingsSelectors";
import Modal from "../../../components/ui/Modal";

const TaskCard = ({ task, onEdit }) => {
    const dispatch = useDispatch();
    const notifications = useSelector(selectNotifications);

    const ownerKey = useSelector((state) =>
        getNotificationOwnerKey(state.auth)
    );

    const apiNotifications = useSelector(
        (state) => state.notifications.notifications
    );

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleStatusChange = async (event) => {
        const newStatus = event.target.value;

        try {
            await dispatch(
                updateTaskStatusAsync({
                    id: task.id,
                    status: newStatus,
                })
            ).unwrap();

            // Delete API-backed deadline reminders when the task is completed.
            if (newStatus === "Completed" && ownerKey) {
                const deadlineReminders = apiNotifications.filter(
                    (notification) =>
                        notification.type === "deadline-reminder" &&
                        String(notification.relatedTaskId) === String(task.id)
                );

                for (const reminder of deadlineReminders) {
                    try {
                        await dispatch(
                            deleteNotificationAsync({
                                ownerKey,
                                id: reminder.id,
                            })
                        ).unwrap();
                    } catch (notificationError) {
                        console.error(
                            "Task status changed, but a deadline reminder could not be deleted:",
                            notificationError
                        );
                    }
                }
            }

            if (notifications.taskUpdates && ownerKey) {
                await dispatch(
                    createNotificationAsync({
                        ownerKey,
                        type:
                            newStatus === "Completed"
                                ? "task-completed"
                                : "task-updated",
                        title:
                            newStatus === "Completed"
                                ? "Task completed"
                                : "Task status updated",
                        message: task.title,
                        relatedTaskId: task.id,
                    })
                ).unwrap();
            }
        } catch (error) {
            console.error("Failed to update task or create notification:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await dispatch(deleteTaskAsync(task.id)).unwrap();

            if (ownerKey) {
                try {
                    await dispatch(
                        createNotificationAsync({
                            ownerKey,
                            type: "task-deleted",
                            title: "Task deleted",
                            message: task.title,
                        })
                    ).unwrap();
                } catch (notificationError) {
                    console.error(
                        "Task was deleted, but its notification failed:",
                        notificationError
                    );
                }
            }

            setShowDeleteModal(false);
        } catch (error) {
            console.error("Task deletion failed:", error);
        }
    };

    const statusIcon =
        task.status === "Completed" ? (
            <CheckCircle2
                size={21}
                className="text-emerald-500"
            />
        ) : task.status === "In Progress" ? (
            <Clock3
                size={21}
                className="text-amber-500"
            />
        ) : (
            <Circle
                size={21}
                className="text-slate-300"
            />
        );

    const priorityStyle =
        task.priority === "High"
            ? "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
            : task.priority === "Medium"
                ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";

    return (
        <div className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-start gap-4">
                <div className="mt-0.5 shrink-0">
                    {statusIcon}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h3
                                className={`font-semibold ${task.status === "Completed"
                                    ? "text-slate-400 line-through dark:text-slate-500"
                                    : "text-slate-900 dark:text-slate-100"
                                    }`}
                            >
                                {task.title}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                {task.description}
                            </p>
                        </div>

                        <span
                            className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyle}`}
                        >
                            {task.priority}
                        </span>
                    </div>

                    {/* dropdown */}
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1.5">
                                <CalendarDays size={14} />
                                {task.dueDate}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => onEdit(task)}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400"
                                aria-label={`Edit ${task.title}`}
                            >
                                <Pencil size={16} />
                            </button>

                            <select
                                value={task.status}
                                onChange={handleStatusChange}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-blue-900"
                                aria-label={`Change status for ${task.title}`}
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>

                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(true)}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950 dark:hover:text-rose-400"
                                aria-label={`Delete ${task.title}`}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete task?"
            >
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Are you sure you want to delete{" "}
                    <span className="font-medium text-slate-900 dark:text-slate-600">
                        "{task.title}"
                    </span>
                    ? This action cannot be undone.
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => setShowDeleteModal(false)}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700 cursor-pointer"
                    >
                        Delete
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default TaskCard;
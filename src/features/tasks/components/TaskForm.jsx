import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask, updateTaskAsync } from "../taskSlice";
import { selectAllProjects } from "../../projects/projectSelectors";
import { createNotificationAsync, deleteNotificationAsync, getNotificationOwnerKey } from "../../notifications/notificationSlice";
import { selectAllNotifications } from "../../notifications/notificationSelectors";
import { selectDefaultPriority, selectDefaultStatus, selectNotifications, } from "../../settings/settingsSelectors";

const initialForm = {
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    projectId: "",
};

const TaskForm = ({ task = null, onClose, initialDueDate = "" }) => {
    const dispatch = useDispatch();

    const ownerKey = useSelector((state) =>
        getNotificationOwnerKey(state.auth)
    );

    const projects = useSelector(selectAllProjects);
    const defaultPriority = useSelector(selectDefaultPriority);
    const defaultStatus = useSelector(selectDefaultStatus);
    const notifications = useSelector(selectNotifications);
    const allNotifications = useSelector(selectAllNotifications);

    const [formData, setFormData] = useState(
        task
            ? {
                title: task.title || "",
                description: task.description || "",
                priority: task.priority || "Medium",
                dueDate:
                    task.dueDate === "No due date"
                        ? ""
                        : task.dueDate || "",
                projectId: task.projectId || "",
            }
            : {
                ...initialForm,
                priority: defaultPriority,
                dueDate: initialDueDate,
            }
    );

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (name === "title" && value.trim()) {
            setValidationError("");
        }
    };

    // Sync the task's deadline reminder with the API
    const syncDeadlineReminder = async (taskId, taskTitle, dueDate, taskStatus) => {
        if (!ownerKey) return;

        // Find existing deadline reminders for this task.
        const existingReminders = allNotifications.filter(
            (notification) =>
                notification.type === "deadline-reminder" &&
                String(notification.relatedTaskId) === String(taskId)
        );

        // Delete the existing reminders using their actual API IDs.
        for (const reminder of existingReminders) {
            await dispatch(
                deleteNotificationAsync({
                    ownerKey,
                    id: reminder.id,
                })
            ).unwrap();
        }

        // Do not create a new reminder if reminders are disabled, the task is completed, or the task has no deadline.
        if (
            !notifications.deadlineReminders ||
            taskStatus === "Completed" ||
            !dueDate ||
            dueDate === "No due date"
        ) {
            return;
        }

        const due = new Date(`${dueDate}T00:00:00`);
        const today = new Date();

        due.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const difference = Math.round(
            (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Do not create reminders for deadlines in the past.
        if (difference < 0) return;

        let deadlineMessage;

        if (difference === 0) {
            deadlineMessage = `${taskTitle} is due today.`;
        } else if (difference === 1) {
            deadlineMessage = `${taskTitle} is due tomorrow.`;
        } else {
            deadlineMessage = `${taskTitle} is due in ${difference} days.`;
        }

        await dispatch(
            createNotificationAsync({
                ownerKey,
                type: "deadline-reminder",
                title: "Upcoming deadline",
                message: deadlineMessage,
                relatedTaskId: taskId,
            })
        ).unwrap();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        if (!formData.title.trim()) {
            setValidationError("Task title is required.");
            return;
        }

        setValidationError("");
        setIsSubmitting(true);

        try {
            if (task) {
                const oldDueDate =
                    task.dueDate === "No due date" ? "" : task.dueDate || "";

                const newDueDate = formData.dueDate || "";

                // Save the task first.
                await dispatch(
                    updateTaskAsync({
                        id: task.id,
                        updates: {
                            title: formData.title.trim(),
                            description: formData.description.trim() || "No description provided.",
                            priority: formData.priority,
                            status: task.status,
                            dueDate: newDueDate || "No due date",
                            projectId: formData.projectId || null,
                        },
                    })
                ).unwrap();

                // Create the task-updated notification through the API.
                if (notifications.taskUpdates && ownerKey) {
                    try {
                        await dispatch(
                            createNotificationAsync({
                                ownerKey,
                                type: "task-updated",
                                title: "Task updated",
                                message: formData.title.trim(),
                                relatedTaskId: task.id,
                            })
                        ).unwrap();
                    } catch (notificationError) {
                        console.error("Task was updated, but its notification failed:", notificationError);
                    }
                }

                // Sync reminders only when the deadline changes or the task is completed.
                // This avoids deleting and recreating a reminder every time an unrelated task field is edited.
                const deadlineChanged = oldDueDate !== newDueDate;

                if (deadlineChanged || task.status === "Completed") {
                    try {
                        await syncDeadlineReminder(
                            task.id,
                            formData.title.trim(),
                            newDueDate,
                            task.status
                        );
                    } catch (notificationError) {
                        console.error("Task was updated, but its deadline reminder could not be synced:", notificationError);
                    }
                }
            } else {
                const newTask = {
                    title: formData.title.trim(),
                    description: formData.description.trim() || "No description provided.",
                    priority: formData.priority,
                    status: defaultStatus,
                    dueDate: formData.dueDate || "No due date",
                    projectId: formData.projectId || null,
                };

                const createdTask = await dispatch(
                    createTask(newTask)
                ).unwrap();

                // Create the task-created notification through the API.
                if (notifications.taskUpdates && ownerKey) {
                    try {
                        await dispatch(
                            createNotificationAsync({
                                ownerKey,
                                type: "task-created",
                                title: "Task created",
                                message: createdTask.title,
                                relatedTaskId: createdTask.id,
                            })
                        ).unwrap();
                    } catch (notificationError) {
                        console.error("Task was created, but its notification failed:", notificationError);
                    }
                }

                // Create a deadline reminder for the new task, if appropriate.
                try {
                    await syncDeadlineReminder(
                        createdTask.id,
                        createdTask.title,
                        createdTask.dueDate,
                        createdTask.status
                    );
                } catch (notificationError) {
                    console.error("Task was created, but its deadline reminder failed:", notificationError);
                }
            }

            onClose();
        } catch (error) {
            console.error("Task save failed:", error);
            setValidationError(error.message || "Unable to save task. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label
                    htmlFor="task-title"
                    className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                    Task title
                </label>

                <input
                    id="task-title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Build authentication flow"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-900"
                />
                {validationError && (
                    <p className="mt-1.5 text-xs text-red-600 dark:text-red-400" role="alert">
                        {validationError}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="task-description"
                    className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                    Description
                </label>

                <textarea
                    id="task-description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="What needs to be done?"
                    className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-900"
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="task-priority"
                        className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                        Priority
                    </label>

                    <select
                        id="task-priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-900"
                    >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>

                {/* Project Selector */}
                <div>
                    <label
                        htmlFor="task-project"
                        className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                        Project
                    </label>

                    <select
                        id="task-project"
                        name="projectId"
                        value={formData.projectId}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-900"
                    >
                        <option value="">Select a project</option>

                        {projects.map((project) => (
                            <option
                                key={project.id}
                                value={project.id}
                            >
                                {project.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="task-due-date"
                        className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                        Due date
                    </label>

                    <input
                        id="task-due-date"
                        name="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-900"
                    />
                </div>
            </div>

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="rounded-lg  px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 cursor-pointer disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 cursor-pointer disabled:opacity-60"
                >
                    {isSubmitting
                        ? task
                            ? "Saving..."
                            : "Creating..."
                        : task
                            ? "Save Changes"
                            : "Create Task"}
                </button>
            </div>
        </form>
    );
}

export default TaskForm;
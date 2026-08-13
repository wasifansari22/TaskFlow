import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTask, updateTask } from "../taskSlice";
import { selectAllProjects } from "../../projects/projectSelectors";

const initialForm = {
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    projectId: "",
};

function TaskForm({ task = null, onClose }) {
    const dispatch = useDispatch();
    const projects = useSelector(selectAllProjects);
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
            : initialForm
    );

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!formData.title.trim()) {
            return;
        }

        if (task) {
            dispatch(
                updateTask({
                    id: task.id,
                    updates: {
                        title: formData.title.trim(),
                        description: formData.description.trim() || "No description provided.",
                        priority: formData.priority,
                        dueDate: formData.dueDate || "No due date",
                        projectId: formData.projectId || null,
                    },
                })
            );
        } else {
            const newTask = {
                id: `task-${Date.now()}`,
                title: formData.title.trim(),
                description: formData.description.trim() || "No description provided.",
                priority: formData.priority,
                status: "Pending",
                dueDate: formData.dueDate || "No due date",
                projectId: formData.projectId || null,
            };
            dispatch(addTask(newTask));
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label
                    htmlFor="task-title"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                    Task title
                </label>

                <input
                    id="task-title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Build authentication flow"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
            </div>

            <div>
                <label
                    htmlFor="task-description"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
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
                    className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="task-priority"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                        Priority
                    </label>

                    <select
                        id="task-priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                        Project
                    </label>

                    <select
                        id="task-project"
                        name="projectId"
                        value={formData.projectId}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                        Due date
                    </label>

                    <input
                        id="task-due-date"
                        name="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>
            </div>

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                    {task ? "Save Changes" : "Create Task"}
                </button>
            </div>
        </form>
    );
}

export default TaskForm;
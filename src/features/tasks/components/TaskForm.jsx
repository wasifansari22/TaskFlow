import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { addTask } from "../taskSlice";

const initialForm = {
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
};

function TaskForm({ onClose }) {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState(initialForm);

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

        const newTask = {
            id: `task-${Date.now()}`,
            title: formData.title.trim(),
            description:
                formData.description.trim() ||
                "No description provided.",
            priority: formData.priority,
            status: "Pending",
            dueDate: formData.dueDate || "No due date",
        };

        dispatch(addTask(newTask));

        setFormData(initialForm);
        onClose();
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-semibold text-slate-900">
                        Create New Task
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Add a task to your workflow.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Close form"
                >
                    <X size={18} />
                </button>
            </div>

            <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-4"
            >
                <div>
                    <label
                        htmlFor="title"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                        Task title
                    </label>

                    <input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Build login page"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <div>
                    <label
                        htmlFor="description"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                        Description
                    </label>

                    <textarea
                        id="description"
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
                            htmlFor="priority"
                            className="mb-1.5 block text-sm font-medium text-slate-700"
                        >
                            Priority
                        </label>

                        <select
                            id="priority"
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

                    <div>
                        <label
                            htmlFor="dueDate"
                            className="mb-1.5 block text-sm font-medium text-slate-700"
                        >
                            Due date
                        </label>

                        <input
                            id="dueDate"
                            name="dueDate"
                            type="date"
                            value={formData.dueDate}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        <Plus size={17} />
                        Create Task
                    </button>
                </div>
            </form>
        </div>
    );
}

export default TaskForm;
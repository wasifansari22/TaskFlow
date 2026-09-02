import { useState } from "react";
import { useDispatch } from "react-redux";
import { createProjectAsync, updateProjectAsync } from "../projectSlice";

const initialForm = {
    name: "",
    description: "",
    priority: "Medium",
    dueDate: "",
};

function ProjectForm({ project = null, onClose }) {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState(
        project
            ? {
                name: project.name || "",
                description: project.description || "",
                priority: project.priority || "Medium",
                dueDate:
                    project.dueDate === "No due date"
                        ? ""
                        : project.dueDate || "",
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.name.trim()) {
            return;
        }

        try {
            if (project) {
                await dispatch(
                    updateProjectAsync({
                        id: project.id,
                        updates: {
                            name: formData.name.trim(),
                            description:
                                formData.description.trim() ||
                                "No description provided.",
                            priority: formData.priority,
                            status: project.status,
                            dueDate:
                                formData.dueDate || "No due date",
                        },
                    })
                ).unwrap();
            } else {
                await dispatch(
                    createProjectAsync({
                        name: formData.name.trim(),
                        description:
                            formData.description.trim() ||
                            "No description provided.",
                        priority: formData.priority,
                        status: "Active",
                        dueDate:
                            formData.dueDate || "No due date",
                    })
                ).unwrap();
            }

            onClose();
        } catch (error) {
            console.error("Project save failed:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label
                    htmlFor="project-name"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                    Project name
                </label>

                <input
                    id="project-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. E-commerce Website"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
            </div>

            <div>
                <label
                    htmlFor="project-description"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                    Description
                </label>

                <textarea
                    id="project-description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="What is this project about?"
                    className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="project-priority"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                        Priority
                    </label>

                    <select
                        id="project-priority"
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
                        htmlFor="project-due-date"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                        Due date
                    </label>

                    <input
                        id="project-due-date"
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
                    {project ? "Save Changes" : "Create Project"}
                </button>
            </div>
        </form>
    );
}

export default ProjectForm;
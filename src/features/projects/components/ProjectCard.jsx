import { CalendarDays, FolderKanban, Trash2, Pencil } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProjectAsync, updateProjectAsync } from "../projectSlice";
import { selectProjectProgress } from "../projectSelectors";
import { selectTasksByProject } from "../../tasks/taskSelectors";
import { Link } from "react-router";

const ProjectCard = ({ project, onEdit }) => {
    const dispatch = useDispatch();
    const progress = useSelector((state) =>
        selectProjectProgress(state, project.id)
    );
    const projectTasks = useSelector((state) =>
        selectTasksByProject(state, project.id)
    );

    const handleStatusChange = async (event) => {
        const newStatus = event.target.value;

        try {
            await dispatch(
                updateProjectAsync({
                    id: project.id,
                    updates: {
                        name: project.name,
                        description: project.description,
                        priority: project.priority,
                        status: newStatus,
                        dueDate: project.dueDate || "No due date",
                    },
                })
            ).unwrap();
        } catch (error) {
            console.error("Project status update failed:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await dispatch(deleteProjectAsync(project.id)).unwrap();
        } catch (error) {
            console.error("Project deletion failed:", error);
        }
    };

    const priorityStyle =
        project.priority === "High"
            ? "bg-rose-50 text-rose-700"
            : project.priority === "Medium"
                ? "bg-amber-50 text-amber-700"
                : "bg-slate-100 text-slate-600";

    const statusStyle =
        project.status === "Completed"
            ? "bg-emerald-50 text-emerald-700"
            : project.status === "On Hold"
                ? "bg-slate-100 text-slate-600"
                : "bg-blue-50 text-blue-700";

    return (
        <article className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <Link
                    to={`/projects/${project.id}`}
                    className="flex min-w-0 items-start gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
                        <FolderKanban size={21} />
                    </div>

                    <div className="min-w-0">
                        <h2 className="truncate font-semibold text-slate-900 transition group-hover:text-blue-600">
                            {project.name}
                        </h2>

                        <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">
                            {project.description}
                        </p>
                    </div>
                </Link>

                <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyle}`}
                >
                    {project.priority}
                </span>
            </div>

            {/* Progress placeholder */}
            <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-600">
                        Progress
                    </span>

                    <span className="font-medium text-slate-600">
                        {progress}%
                    </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                        className="h-full rounded-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                    {projectTasks.length}{" "}
                    {projectTasks.length === 1 ? "task" : "tasks"}
                </p>
            </div>

            {/* Footer */}
            <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <CalendarDays size={14} />
                    {project.dueDate || "No due date"}
                </div>

                <div className="flex items-center gap-2">
                    <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle}`}
                    >
                        {project.status}
                    </span>

                    <select
                        value={project.status}
                        onChange={handleStatusChange}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        aria-label={`Change status for ${project.name}`}
                    >
                        <option value="Active">Active</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Completed">Completed</option>
                    </select>

                    <button
                        type="button"
                        onClick={() => onEdit(project)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                        aria-label={`Edit ${project.name}`}
                    >
                        <Pencil size={16} />
                    </button>

                    <button
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();
                            handleDelete();
                        }}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                        aria-label={`Delete ${project.name}`}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </article>
    );
}

export default ProjectCard;
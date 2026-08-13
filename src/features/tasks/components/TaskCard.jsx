import { CalendarDays, CheckCircle2, Circle, Clock3, Trash2, Pencil } from "lucide-react";
import { useDispatch } from "react-redux";
import { deleteTask, updateTaskStatus, } from "../taskSlice";

const TaskCard = ({ task, onEdit }) => {
    const dispatch = useDispatch();

    const handleStatusChange = (event) => {
        dispatch(updateTaskStatus({
            id: task.id,
            status: event.target.value,
        }));
    };

    const handleDelete = () => {
        dispatch(deleteTask(task.id));
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
            ? "bg-rose-50 text-rose-700"
            : task.priority === "Medium"
                ? "bg-amber-50 text-amber-700"
                : "bg-slate-100 text-slate-600";

    return (
        <div className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
            <div className="flex items-start gap-4">
                <div className="mt-0.5 shrink-0">
                    {statusIcon}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h3
                                className={`font-semibold ${task.status === "Completed"
                                    ? "text-slate-400 line-through"
                                    : "text-slate-900"
                                    }`}
                            >
                                {task.title}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
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
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <CalendarDays size={14} />
                                {task.dueDate}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => onEdit(task)}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                                aria-label={`Edit ${task.title}`}
                            >
                                <Pencil size={16} />
                            </button>

                            <select
                                value={task.status}
                                onChange={handleStatusChange}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                aria-label={`Change status for ${task.title}`}
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>

                            <button
                                type="button"
                                onClick={handleDelete}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                                aria-label={`Delete ${task.title}`}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default TaskCard;
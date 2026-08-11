import { CalendarDays, CheckCircle2, Circle, Clock3, Trash2, } from "lucide-react";
import { useDispatch } from "react-redux";
import { deleteTask, toggleTask, } from "../taskSlice";

function TaskCard({ task }) {
    const dispatch = useDispatch();

    const handleToggle = () => {
        dispatch(toggleTask(task.id));
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
                <button
                    type="button"
                    onClick={handleToggle}
                    className="mt-0.5 shrink-0 rounded-full transition hover:scale-105"
                    aria-label={
                        task.status === "Completed"
                            ? "Mark task as pending"
                            : "Mark task as completed"
                    }
                >
                    {statusIcon}
                </button>

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

                    <div className="mt-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <CalendarDays size={14} />
                                {task.dueDate}
                            </span>

                            <span className="hidden sm:inline">
                                {task.status}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={handleDelete}
                            className="rounded-lg p-2 text-slate-400 opacity-100 transition hover:bg-rose-50 hover:text-rose-600 sm:opacity-0 sm:group-hover:opacity-100"
                            aria-label={`Delete ${task.title}`}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskCard;
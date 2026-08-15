import { Link } from "react-router";
import { useSelector } from "react-redux";
import { selectAllTasks } from "../../tasks/taskSelectors";
import { selectAllProjects } from "../../projects/projectSelectors";
import { CheckCircle2, Circle, Clock3, ArrowRight, } from "lucide-react";

const RecentTasks = () => {
    const tasks = useSelector(selectAllTasks);
    const projects = useSelector(selectAllProjects);
    const recentTasks = tasks.slice(0, 4);

    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
                <div>
                    <h2 className="font-semibold text-slate-900">
                        Recent Tasks
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Keep track of your latest work.
                    </p>
                </div>

                <Link
                    to="/tasks"
                    className="flex items-center gap-1 text-sm font-medium text-blue-600 transition hover:text-blue-700"
                >
                    View all
                    <ArrowRight size={16} />
                </Link>
            </div>

            <div className="divide-y divide-slate-100">
                {recentTasks.map((task) => {
                    const project = projects.find((project) => project.id === task.projectId);
                    return (
                        <div
                            key={task.id}
                            className="flex items-center gap-4 p-5 transition hover:bg-slate-50"
                        >
                            <div className="shrink-0">
                                {task.status === "Completed" ? (
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
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p
                                    className={`truncate text-sm font-medium ${task.status === "Completed"
                                        ? "text-slate-400 line-through"
                                        : "text-slate-900"
                                        }`}
                                >
                                    {task.title}
                                </p>

                                <p className="mt-1 truncate text-xs text-slate-500">
                                    {project?.name || "No project"}
                                </p>
                            </div>

                            <span
                                className={`hidden rounded-full px-2.5 py-1 text-xs font-medium sm:inline-flex ${task.status === "Completed"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : task.status === "In Progress"
                                        ? "bg-amber-50 text-amber-700"
                                        : "bg-slate-100 text-slate-600"
                                    }`}
                            >
                                {task.status}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default RecentTasks;
import { ArrowRight, CheckCircle2, Circle, Clock3 } from "lucide-react";
import { Link } from "react-router";
import { useSelector } from "react-redux";

import { selectAllTasks } from "../../tasks/taskSelectors";
import { selectAllProjects } from "../../projects/projectSelectors";

const RecentTasks = () => {
    const tasks = useSelector(selectAllTasks);
    const projects = useSelector(selectAllProjects);

    const recentTasks = [...tasks]
        .sort(
            (a, b) =>
                new Date(b.created_at) - new Date(a.created_at)
        )
        .slice(0, 4);

    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Header */}
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
                    className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition hover:text-blue-700"
                >
                    View all
                    <ArrowRight size={16} />
                </Link>
            </div>

            {/* Tasks / Empty State */}
            <div className="divide-y divide-slate-100">
                {recentTasks.length === 0 ? (
                    <div className="p-8 text-center">
                        <Circle
                            size={32}
                            className="mx-auto text-slate-300"
                        />

                        <p className="mt-3 font-medium text-slate-900">
                            No tasks yet
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            Create your first task to start tracking your work.
                        </p>

                        <Link
                            to="/tasks"
                            className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            Create Task
                        </Link>
                    </div>
                ) : (
                    recentTasks.map((task) => {
                        const project = projects.find(
                            (project) =>
                                Number(project.id) ===
                                Number(task.projectId)
                        );

                        return (
                            <div
                                key={task.id}
                                className="flex items-center justify-between gap-4 p-5"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="shrink-0">
                                        {task.status === "Completed" ? (
                                            <CheckCircle2
                                                size={20}
                                                className="text-emerald-500"
                                            />
                                        ) : task.status === "In Progress" ? (
                                            <Clock3
                                                size={20}
                                                className="text-amber-500"
                                            />
                                        ) : (
                                            <Circle
                                                size={20}
                                                className="text-slate-400"
                                            />
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-slate-900">
                                            {task.title}
                                        </p>

                                        <p className="mt-1 truncate text-xs text-slate-500">
                                            {project?.name || "No project"}
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${task.status === "Completed"
                                            ? "bg-emerald-50 text-emerald-700"
                                            : task.status === "In Progress"
                                                ? "bg-amber-50 text-amber-700"
                                                : "bg-slate-100 text-slate-600"
                                        }`}
                                >
                                    {task.status}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default RecentTasks;
import { ArrowUpRight, CheckCircle2, Circle, Clock3, } from "lucide-react";
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
        .slice(0, 5);

    const getStatusStyle = (status) => {
        if (status === "Completed") {
            return "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-400/20";
        }

        if (status === "In Progress") {
            return "bg-amber-50 text-amber-700 ring-amber-600/10 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-400/20";
        }

        return "bg-slate-100 text-slate-600 ring-slate-500/10 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-400/20";
    };

    const getStatusIcon = (status) => {
        if (status === "Completed") {
            return <CheckCircle2 size={19} className="text-emerald-500" />;
        }

        if (status === "In Progress") {
            return <Clock3 size={19} className="text-amber-500" />;
        }

        return <Circle size={19} className="text-slate-400 dark:text-slate-500" />;
    };

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5 dark:border-slate-800 sm:p-6">
                <div>
                    <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
                        Recent Tasks
                    </h2>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Keep track of your latest work.
                    </p>
                </div>

                <Link
                    to="/tasks"
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/50"
                >
                    View all
                    <ArrowUpRight size={16} />
                </Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentTasks.length === 0 ? (
                    <div className="px-5 py-12 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                            <Circle size={24} />
                        </div>

                        <p className="mt-4 font-semibold text-slate-900 dark:text-white">
                            No tasks yet
                        </p>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Create your first task to start tracking your work.
                        </p>

                        <Link
                            to="/tasks"
                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
                        >
                            Create Task
                            <ArrowUpRight size={15} />
                        </Link>
                    </div>
                ) : (
                    recentTasks.map((task) => {
                        const project = projects.find(
                            (project) =>
                                Number(project.id) === Number(task.projectId)
                        );

                        return (
                            <div
                                key={task.id}
                                className="flex items-center justify-between gap-3 px-5 py-4 transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40 sm:px-6"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800">
                                        {getStatusIcon(task.status)}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                                            {task.title}
                                        </p>

                                        <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                                            {project?.name || "No project"}
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${getStatusStyle(task.status)}`}
                                >
                                    {task.status}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>
        </section>
    );
};

export default RecentTasks;
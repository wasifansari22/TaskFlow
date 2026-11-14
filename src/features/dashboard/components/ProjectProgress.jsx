import { ArrowUpRight, FolderKanban, Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import { selectDashboardProjects } from "../dashboardSelectors";

const ProjectProgress = () => {
    const projects = useSelector(selectDashboardProjects);

    return (
        <section className="h-full rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
                        Project Progress
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Track the progress of your active projects.
                    </p>
                </div>

                <Link
                    to="/projects"
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/50"
                >
                    View all
                    <ArrowUpRight size={16} />
                </Link>
            </div>

            <div className="mt-6">
                {projects.length === 0 ? (
                    <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-8 text-center dark:border-slate-700 dark:bg-slate-800/30">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                            <FolderKanban size={23} />
                        </div>

                        <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                            No active projects
                        </h3>

                        <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">
                            Create a project to start tracking your progress.
                        </p>

                        <Link
                            to="/projects"
                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
                        >
                            <Plus size={16} />
                            Create Project
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {projects.slice(0, 4).map((project) => (
                            <Link
                                key={project.id}
                                to="/projects"
                                className="group block rounded-xl p-2 -mx-2 transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-800 transition group-hover:text-indigo-600 dark:text-slate-200 dark:group-hover:text-indigo-400">
                                            {project.name}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            {project.completedTasks} of {project.totalTasks} tasks completed
                                        </p>
                                    </div>

                                    <span className="shrink-0 text-sm font-semibold tabular-nums text-slate-700 dark:text-slate-300">
                                        {project.progress}%
                                    </span>
                                </div>

                                <div
                                    className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700/80"
                                    role="progressbar"
                                    aria-label={`${project.name} progress`}
                                    aria-valuenow={project.progress}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                >
                                    <div
                                        className="h-full rounded-full bg-linear-to-r from-indigo-500 to-blue-500 transition-all duration-500"
                                        style={{
                                            width: `${project.progress}%`,
                                        }}
                                    />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProjectProgress;
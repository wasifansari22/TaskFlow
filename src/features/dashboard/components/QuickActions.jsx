import { Link } from "react-router";
import { ArrowUpRight, CheckSquare, FolderPlus, Plus, } from "lucide-react";

const QuickActions = () => {
    return (
        <section className="h-full rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div>
                <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
                    Quick Actions
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Jump straight into your workflow.
                </p>
            </div>

            <div className="mt-6 space-y-3">
                <Link
                    to="/tasks"
                    className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50/50 hover:shadow-sm dark:border-slate-700 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/30"
                >
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:group-hover:bg-indigo-950">
                            <CheckSquare size={20} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                New Task
                            </p>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Add something to your task list
                            </p>
                        </div>
                    </div>

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-indigo-600 group-hover:text-white dark:bg-slate-800 dark:text-slate-400">
                        <Plus size={17} />
                    </div>
                </Link>

                <Link
                    to="/projects"
                    className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50/50 hover:shadow-sm dark:border-slate-700 dark:hover:border-violet-800 dark:hover:bg-violet-950/30"
                >
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition group-hover:bg-violet-100 dark:bg-violet-950/60 dark:text-violet-400 dark:group-hover:bg-violet-950">
                            <FolderPlus size={20} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                New Project
                            </p>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Start organizing your work
                            </p>
                        </div>
                    </div>

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-violet-600 group-hover:text-white dark:bg-slate-800 dark:text-slate-400">
                        <ArrowUpRight size={17} />
                    </div>
                </Link>
            </div>
        </section>
    );
}

export default QuickActions;
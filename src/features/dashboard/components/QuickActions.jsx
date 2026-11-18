import { Link } from "react-router";
import { ArrowUpRight, CalendarDays, CheckSquare, FolderPlus, Plus, } from "lucide-react";

const QuickActions = () => {
    return (
        <section className="h-full rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-[#292e3a] dark:bg-[#151821] sm:p-5">
            <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    Quick Actions
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Jump straight into your workflow.
                </p>
            </div>

            <div className="mt-6 space-y-3">
                <Link
                    to="/tasks"
                    className="group flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-2.5 transition hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-[#292e3a] dark:bg-[#151821] dark:hover:border-indigo-500/50 dark:hover:bg-[#1c202b]"
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
                    className="group flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 transition hover:border-violet-300 hover:bg-violet-50/50 dark:border-[#292e3a] dark:bg-[#151821] dark:hover:border-violet-500/50 dark:hover:bg-[#1c202b]"
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

                {/* <Link
                    to="/calendar"
                    className="group flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 transition hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-[#292e3a] dark:bg-[#151821] dark:hover:border-indigo-500/50 dark:hover:bg-[#1c202b]"
                >
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:group-hover:bg-indigo-950">
                            <CalendarDays size={20} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                Calendar
                            </p>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                View your schedule and upcoming deadlines
                            </p>
                        </div>
                    </div>

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-indigo-600 group-hover:text-white dark:bg-slate-800 dark:text-slate-400">
                        <ArrowUpRight size={17} />
                    </div>
                </Link> */}
            </div>
        </section>
    );
}

export default QuickActions;
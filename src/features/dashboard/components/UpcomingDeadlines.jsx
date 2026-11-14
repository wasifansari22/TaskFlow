import { ArrowUpRight, CalendarDays, CircleCheck, Clock3, } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import { differenceInCalendarDays, format, isToday, startOfDay, } from "date-fns";
import { selectAllTasks } from "../../tasks/taskSelectors";

const UpcomingDeadlines = () => {
    const tasks = useSelector(selectAllTasks);

    const upcomingTasks = [...tasks]
        .filter((task) => {
            if (!task.dueDate || task.dueDate === "No due date") {
                return false;
            }

            if (task.status === "Completed") {
                return false;
            }

            return true;
        })
        .sort(
            (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
        )
        .slice(0, 5);

    const getDeadlineLabel = (dueDate) => {
        const date = startOfDay(new Date(dueDate));
        const today = startOfDay(new Date());
        const difference = differenceInCalendarDays(date, today);

        if (isToday(date)) {
            return "Due today";
        }

        if (difference === 1) {
            return "Due tomorrow";
        }

        if (difference > 1) {
            return `Due in ${difference} days`;
        }

        return "Overdue";
    };

    const getDeadlineStyle = (difference) => {
        if (difference < 0) {
            return {
                badge: "bg-rose-50 text-rose-700 ring-rose-600/10 dark:bg-rose-950/50 dark:text-rose-300 dark:ring-rose-400/20",
                icon: "text-rose-500",
            };
        }

        if (difference === 0) {
            return {
                badge: "bg-amber-50 text-amber-700 ring-amber-600/10 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-400/20",
                icon: "text-amber-500",
            };
        }

        return {
            badge: "bg-indigo-50 text-indigo-700 ring-indigo-600/10 dark:bg-indigo-950/50 dark:text-indigo-300 dark:ring-indigo-400/20",
            icon: "text-indigo-500",
        };
    };

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5 dark:border-slate-800 sm:p-6">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                        <CalendarDays size={20} />
                    </div>

                    <div className="min-w-0">
                        <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
                            Upcoming Deadlines
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Stay ahead of your upcoming work.
                        </p>
                    </div>
                </div>

                <Link
                    to="/tasks"
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/50"
                >
                    View all
                    <ArrowUpRight size={16} />
                </Link>
            </div>

            {upcomingTasks.length === 0 ? (
                <div className="px-5 py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-400">
                        <CircleCheck size={25} />
                    </div>

                    <p className="mt-4 font-semibold text-slate-900 dark:text-white">
                        No upcoming deadlines
                    </p>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        You're all caught up.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {upcomingTasks.map((task) => {
                        const date = startOfDay(new Date(task.dueDate));
                        const difference = differenceInCalendarDays(
                            date,
                            startOfDay(new Date())
                        );

                        const deadlineLabel = getDeadlineLabel(task.dueDate);
                        const deadlineStyle = getDeadlineStyle(difference);

                        return (
                            <div
                                key={task.id}
                                className="flex items-center justify-between gap-3 px-5 py-4 transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40 sm:px-6"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800">
                                        <Clock3
                                            size={18}
                                            className={deadlineStyle.icon}
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                                            {task.title}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            {format(date, "MMM d, yyyy")}
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${deadlineStyle.badge}`}
                                >
                                    {deadlineLabel}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default UpcomingDeadlines;
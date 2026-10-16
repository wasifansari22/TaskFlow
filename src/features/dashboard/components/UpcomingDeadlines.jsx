import { ArrowRight, CalendarDays, CircleCheck } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import { differenceInCalendarDays, format, isToday, startOfDay, } from "date-fns";
import { selectAllTasks } from "../../tasks/taskSelectors";

const UpcomingDeadlines = () => {
    const tasks = useSelector(selectAllTasks);

    // Get taskk that has an active deadline.
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

    // Create a readable label for each deadline.
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

    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 dark:border-slate-700">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                        <CalendarDays size={20} />
                    </div>

                    <div className="min-w-0">
                        <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                            Upcoming Deadlines
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Stay ahead of your upcoming work.
                        </p>
                    </div>
                </div>

                <Link
                    to="/tasks"
                    className="flex shrink-0 items-center gap-1 whitespace-nowrap pt-1 text-sm font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    View all
                    <ArrowRight size={16} />
                </Link>
            </div>

            {/* Deadlines / Empty State */}
            {upcomingTasks.length === 0 ? (
                <div className="p-8 text-center">
                    <CircleCheck
                        size={32}
                        className="mx-auto text-emerald-400"
                    />

                    <p className="mt-3 font-medium text-slate-900 dark:text-slate-100">
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

                        const deadlineLabel = getDeadlineLabel(task.dueDate);

                        const difference = differenceInCalendarDays(
                            date,
                            startOfDay(new Date())
                        );

                        const overdue = difference < 0;
                        const dueToday = difference === 0;

                        const deadlineStyle = overdue
                            ? "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                            : dueToday
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                                : "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300";

                        return (
                            <div
                                key={task.id}
                                className="flex items-center justify-between gap-4 p-5 transition hover:bg-slate-50 dark:hover:bg-slate-800"
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                                        {task.title}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        {format(date, "MMM d, yyyy")}
                                    </p>
                                </div>

                                <span
                                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${deadlineStyle}`}
                                >
                                    {deadlineLabel}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default UpcomingDeadlines;
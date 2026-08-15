import { CalendarDays } from "lucide-react";
import { useSelector } from "react-redux";
import { differenceInCalendarDays, format, isPast, isToday, } from "date-fns";
import { selectAllTasks } from "../../tasks/taskSelectors";

const UpcomingDeadlines = () => {
    // gives this component the real tasks from redux.
    const tasks = useSelector(selectAllTasks);

    // filter the upcoming tasks
    const upcomingTasks = tasks.filter((task) => {
        if (!task.dueDate || task.dueDate === "No due date") {
            return false;
        }

        if (task.status === "Completed") {
            return false;
        }

        return true;
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 5);

    // deadline label
    const getDeadlineLabel = (dueDate) => {
        const date = new Date(dueDate);
        const today = new Date();

        const difference = differenceInCalendarDays(
            date,
            today
        );

        if (isToday(date)) {
            return "Due today";
        }

        if (difference === 1) {
            return "Due tomorrow";
        }

        if (difference > 1) {
            return `Due in ${difference} days`;
        }

        if (isPast(date)) {
            return "Overdue";
        }

        return format(date, "MMM d, yyyy");
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <CalendarDays size={19} />
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-900">
                            Upcoming Deadlines
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Stay ahead of your upcoming work.
                        </p>
                    </div>
                </div>
            </div>

            {upcomingTasks.length === 0 ? (
                <div className="p-8 text-center">
                    <p className="font-medium text-slate-900">
                        No upcoming deadlines
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        You're all caught up.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-slate-100">
                    {upcomingTasks.map((task) => {
                        const deadlineLabel = getDeadlineLabel(
                            task.dueDate
                        );

                        const date = new Date(task.dueDate);

                        const overdue =
                            isPast(date) && !isToday(date);

                        return (
                            <div
                                key={task.id}
                                className="flex items-center justify-between gap-4 p-5 transition hover:bg-slate-50"
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-slate-900">
                                        {task.title}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {format(date, "MMM d, yyyy")}
                                    </p>
                                </div>

                                <span
                                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${overdue
                                        ? "bg-rose-50 text-rose-700"
                                        : isToday(date)
                                            ? "bg-amber-50 text-amber-700"
                                            : "bg-blue-50 text-blue-700"
                                        }`}
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
}

export default UpcomingDeadlines;
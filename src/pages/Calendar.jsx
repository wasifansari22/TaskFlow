import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectTasksByDueDate } from "../features/tasks/taskSelectors";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Modal from "../components/ui/Modal";
import TaskForm from "../features/tasks/components/TaskForm";

const Calendar = () => {
    const today = new Date();

    const tasks = useSelector((state) => state.tasks.tasks);
    const tasksByDate = useMemo(() => {
        return tasks.reduce((accumulator, task) => {
            if (!task.dueDate || task.dueDate === "No due date") {
                return accumulator;
            }

            if (!accumulator[task.dueDate]) {
                accumulator[task.dueDate] = [];
            }

            accumulator[task.dueDate].push(task);

            return accumulator;
        }, {});
    }, [tasks]);

    const [selectedDate, setSelectedDate] = useState(
        today.toISOString().split("T")[0]
    );

    const [showTaskForm, setShowTaskForm] = useState(false);

    const [showMobileTasks, setShowMobileTasks] = useState(false);

    const selectedTasks = selectedDate
        ? tasksByDate[selectedDate] || []
        : [];

    const [currentDate, setCurrentDate] = useState(
        new Date(today.getFullYear(), today.getMonth(), 1)
    );

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const monthName = currentDate.toLocaleString("default", {
        month: "long",
    });

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = Array.from(
        { length: firstDayOfMonth + daysInMonth },
        (_, index) => {
            if (index < firstDayOfMonth) {
                return null;
            }
            return index - firstDayOfMonth + 1;
        }
    );
    const goToPreviousMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };
    const goToNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    };

    return (
        <div className="mx-auto w-full max-w-7xl space-y-8">
            {/* Header */}
            <section>
                <p className="text-sm font-medium text-blue-600">
                    Workspace
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                    Calendar
                </h1>

                <p className="mt-2 text-slate-600">
                    View your schedule and upcoming deadlines.
                </p>
            </section>

            {/* Calendar */}
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                {/* Calendar Header */}
                <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">
                            {monthName} {year}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={goToToday}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                        >
                            Today
                        </button>

                        <button
                            type="button"
                            onClick={goToPreviousMonth}
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
                            aria-label="Previous month"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <button
                            type="button"
                            onClick={goToNextMonth}
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
                            aria-label="Next month"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Weekdays */}
                <div className="grid grid-cols-7 border-b border-slate-200">
                    {[
                        "Sun",
                        "Mon",
                        "Tue",
                        "Wed",
                        "Thu",
                        "Fri",
                        "Sat",
                    ].map((day) => (
                        <div
                            key={day}
                            className="p-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-400"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days */}
                <div className="grid grid-cols-7">
                    {days.map((day, index) => {
                        const dateString = day
                            ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                            : null;

                        const tasksForDay = dateString
                            ? tasksByDate[dateString] || []
                            : [];

                        return (
                            <div
                                key={index}
                                onClick={() => {
                                    if (!day) return;

                                    setSelectedDate(dateString);

                                    if (window.matchMedia("(max-width: 639px)").matches) {
                                        setShowMobileTasks(true);
                                    }
                                }}
                                className={`min-h-24 border-b border-r border-slate-100 p-2 sm:min-h-28 sm:p-3 ${day ? "cursor-pointer transition hover:bg-slate-50" : ""
                                    }`}
                            >
                                {day && (
                                    <>
                                        <span
                                            className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium ${selectedDate === dateString
                                                ? "bg-blue-600 text-white"
                                                : "text-slate-700"
                                                }`}
                                        >
                                            {day}
                                        </span>

                                        {tasksForDay.length > 0 && (
                                            <>
                                                {/* Desktop: show task titles */}
                                                <div className="mt-2 hidden space-y-1 sm:block">
                                                    {tasksForDay.map((task) => (
                                                        <div
                                                            key={task.id}
                                                            className="truncate rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                                                            title={task.title}
                                                        >
                                                            {task.title}
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Mobile: show task indicators */}
                                                <div className="mt-2 flex items-center gap-1.5 sm:hidden">
                                                    <span className="h-1 w-1 rounded-full bg-blue-500" />

                                                    <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600">
                                                        {tasksForDay.length}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>

            </section>

            {/* Daily Task Panel */}
            <section className="hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:block">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="font-semibold text-slate-900">
                            {selectedDate
                                ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
                                    "en-US",
                                    {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    }
                                )
                                : "Select a date"}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Tasks scheduled for this day.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowTaskForm(true)}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        + Add Task
                    </button>
                </div>

                {selectedTasks.length === 0 ? (
                    <div className="mt-6 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                        <p className="text-sm font-medium text-slate-700">
                            No tasks scheduled
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            There are no tasks due on this date.
                        </p>
                    </div>
                ) : (
                    <div className="mt-5 space-y-3">
                        {selectedTasks.map((task) => (
                            <div
                                key={task.id}
                                className="rounded-lg border border-slate-200 p-4 transition hover:shadow-sm"
                            >
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="min-w-0">
                                        <h3
                                            className={`font-medium ${task.status === "Completed"
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

                                    <div className="flex shrink-0 items-center gap-2">
                                        <span
                                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${task.priority === "High"
                                                ? "bg-rose-50 text-rose-700"
                                                : task.priority === "Medium"
                                                    ? "bg-amber-50 text-amber-700"
                                                    : "bg-slate-100 text-slate-600"
                                                }`}
                                        >
                                            {task.priority}
                                        </span>

                                        <span
                                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${task.status === "Completed"
                                                ? "bg-emerald-50 text-emerald-700"
                                                : task.status === "In Progress"
                                                    ? "bg-blue-50 text-blue-700"
                                                    : "bg-slate-100 text-slate-600"
                                                }`}
                                        >
                                            {task.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Mobile Daily Tasks Modal */}
            <div className="sm:hidden">
                <Modal
                    isOpen={showMobileTasks}
                    onClose={() => setShowMobileTasks(false)}
                    title={
                        selectedDate
                            ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
                                "en-US",
                                {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                }
                            )
                            : "Selected Date"
                    }
                >
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-slate-500">
                                Tasks scheduled for this day.
                            </p>
                        </div>

                        {selectedTasks.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                                <p className="text-sm font-medium text-slate-700">
                                    No tasks scheduled
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    There are no tasks due on this date.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {selectedTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="rounded-lg border border-slate-200 p-4"
                                    >
                                        <h3
                                            className={`font-medium ${task.status === "Completed"
                                                    ? "text-slate-400 line-through"
                                                    : "text-slate-900"
                                                }`}
                                        >
                                            {task.title}
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-500">
                                            {task.description}
                                        </p>

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${task.priority === "High"
                                                        ? "bg-rose-50 text-rose-700"
                                                        : task.priority === "Medium"
                                                            ? "bg-amber-50 text-amber-700"
                                                            : "bg-slate-100 text-slate-600"
                                                    }`}
                                            >
                                                {task.priority}
                                            </span>

                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${task.status === "Completed"
                                                        ? "bg-emerald-50 text-emerald-700"
                                                        : task.status === "In Progress"
                                                            ? "bg-blue-50 text-blue-700"
                                                            : "bg-slate-100 text-slate-600"
                                                    }`}
                                            >
                                                {task.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => {
                                setShowMobileTasks(false);
                                setShowTaskForm(true);
                            }}
                            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            Add Task
                        </button>
                    </div>
                </Modal>
            </div>

            {/* Modal  */}
            <Modal
                isOpen={showTaskForm}
                onClose={() => setShowTaskForm(false)}
                title="Create New Task"
            >
                <TaskForm
                    initialDueDate={selectedDate}
                    onClose={() => setShowTaskForm(false)}
                />
            </Modal>
        </div>
    );
}

export default Calendar;
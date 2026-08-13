import { useMemo, useState } from "react";
import { CheckCircle2, Clock3, ListTodo, Plus, Search, } from "lucide-react";
import { useSelector } from "react-redux";
import { selectAllTasks, selectCompletedTasks, selectInProgressTasks, selectPendingTasks, } from "../features/tasks/taskSelectors";
import TaskForm from "../features/tasks/components/TaskForm";
import TaskList from "../features/tasks/components/TaskList";
import Modal from "../components/ui/Modal";

const Tasks = () => {
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const tasks = useSelector(selectAllTasks);
    const completedTasks = useSelector(selectCompletedTasks);
    const inProgressTasks = useSelector(selectInProgressTasks);
    const pendingTasks = useSelector(selectPendingTasks);

    const stats = useMemo(
        () => [
            {
                label: "All Tasks",
                value: tasks.length,
                icon: ListTodo,
                style: "bg-blue-50 text-blue-600",
            },
            {
                label: "In Progress",
                value: inProgressTasks.length,
                icon: Clock3,
                style: "bg-amber-50 text-amber-600",
            },
            {
                label: "Completed",
                value: completedTasks.length,
                icon: CheckCircle2,
                style: "bg-emerald-50 text-emerald-600",
            },
            {
                label: "Pending",
                value: pendingTasks.length,
                icon: ListTodo,
                style: "bg-slate-100 text-slate-600",
            },
        ],
        [
            tasks.length,
            inProgressTasks.length,
            completedTasks.length,
            pendingTasks.length,
        ]
    );

    const filters = [
        "All",
        "Pending",
        "In Progress",
        "Completed",
    ];

    return (
        <div className="mx-auto w-full max-w-7xl space-y-8">
            {/* Header */}
            <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-medium text-blue-600">
                        Workspace
                    </p>

                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                        Tasks
                    </h1>

                    <p className="mt-2 text-slate-600">
                        Manage your tasks and keep your work moving.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setEditingTask(null);
                        setShowForm(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                >
                    <Plus size={18} />
                    New Task
                </button>
            </section>

            {/* Statistics */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.label}
                            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.style}`}
                                >
                                    <Icon size={19} />
                                </div>

                                <div>
                                    <p className="text-sm text-slate-500">
                                        {stat.label}
                                    </p>

                                    <p className="text-2xl font-bold text-slate-900">
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* Create Form */}
            <Modal
                isOpen={showForm || editingTask !== null}
                onClose={() => {
                    setShowForm(false);
                    setEditingTask(null);
                }}
                title={editingTask ? "Edit Task" : "Create New Task"}
            >
                <TaskForm
                    task={editingTask}
                    onClose={() => {
                        setShowForm(false);
                        setEditingTask(null);
                    }}
                />
            </Modal>

            {/* Search + Filters */}
            <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full lg:max-w-md">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="search"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search tasks..."
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <div className="flex gap-1 overflow-x-auto rounded-lg bg-slate-100 p-1">
                    {filters.map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => setFilter(item)}
                            className={`whitespace-nowrap rounded-md px-3 py-2 text-xs font-medium transition ${filter === item
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-slate-500 hover:text-slate-900"
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </section>

            {/* Task List */}
            <section>
                <TaskList
                    filter={filter}
                    search={search}
                    onEdit={setEditingTask}
                />
            </section>
        </div>
    );
}

export default Tasks;
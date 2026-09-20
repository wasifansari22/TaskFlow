import { useSelector } from "react-redux";
import { selectAllTasks } from "../taskSelectors";
import TaskCard from "./TaskCard";

function TaskList({ filter, search, onEdit, onClearFilters }) {
    const tasks = useSelector(selectAllTasks);

    const filteredTasks = tasks.filter((task) => {
        const matchesFilter =
            filter === "All" || task.status === filter;

        const searchTerm = search.toLowerCase();

        const matchesSearch =
            task.title.toLowerCase().includes(searchTerm) ||
            task.description.toLowerCase().includes(searchTerm);

        return matchesFilter && matchesSearch;
    });

    if (filteredTasks.length === 0) {
        const hasTasks = tasks.length > 0;

        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <p className="font-medium text-slate-900">
                    {hasTasks ? "No tasks found" : "No tasks yet"}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                    {hasTasks
                        ? "Try changing your search or filter."
                        : "Create your first task to start organizing your work."}
                </p>

                {hasTasks && (
                    <button
                        type="button"
                        onClick={onClearFilters}
                        className="mt-4 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        Clear search & filters
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {filteredTasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
}

export default TaskList;
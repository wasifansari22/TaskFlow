import { useSelector } from "react-redux";
import { selectAllTasks } from "../taskSelectors";
import TaskCard from "./TaskCard";

function TaskList({ filter, search, onEdit }) {
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
        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <p className="font-medium text-slate-900">
                    No tasks found
                </p>

                <p className="mt-1 text-sm text-slate-500">
                    Try changing your search or filter.
                </p>
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
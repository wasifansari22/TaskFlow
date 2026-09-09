import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { Circle } from "lucide-react";
import { useSelector } from "react-redux";

import {
    selectCompletedTasks,
    selectInProgressTasks,
    selectPendingTasks,
} from "../../tasks/taskSelectors";

const COLORS = ["#10b981", "#f59e0b", "#94a3b8"];

const TaskAnalytics = () => {
    const completedTasks = useSelector(selectCompletedTasks);
    const inProgressTasks = useSelector(selectInProgressTasks);
    const pendingTasks = useSelector(selectPendingTasks);

    const data = [
        {
            name: "Completed",
            value: completedTasks.length,
        },
        {
            name: "In Progress",
            value: inProgressTasks.length,
        },
        {
            name: "Pending",
            value: pendingTasks.length,
        },
    ];

    const hasTaskData = data.some((item) => item.value > 0);

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            {/* Header */}
            <div>
                <h2 className="font-semibold text-slate-900">
                    Task Analytics
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Distribution of your tasks by status.
                </p>
            </div>

            {/* Chart / Empty State */}
            <div className="mt-6 h-64">
                {hasTaskData ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index]}
                                    />
                                ))}
                            </Pie>

                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                        <Circle
                            size={32}
                            className="text-slate-300"
                        />

                        <p className="mt-3 font-medium text-slate-900">
                            No task data yet
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            Create tasks to see your task distribution.
                        </p>
                    </div>
                )}
            </div>

            {/* Legend */}
            {hasTaskData && (
                <div className="grid grid-cols-3 gap-2">
                    {data.map((item, index) => (
                        <div
                            key={item.name}
                            className="text-center"
                        >
                            <div className="flex items-center justify-center gap-1.5">
                                <span
                                    className="h-2 w-2 rounded-full"
                                    style={{
                                        backgroundColor: COLORS[index],
                                    }}
                                />

                                <span className="text-xs text-slate-500">
                                    {item.name}
                                </span>
                            </div>

                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TaskAnalytics;
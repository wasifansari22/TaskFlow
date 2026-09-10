import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, } from "recharts";
import { CheckCircle2, Circle } from "lucide-react";
import { useSelector } from "react-redux";
import { selectCompletedTasks, selectInProgressTasks, selectPendingTasks, } from "../../tasks/taskSelectors";

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

    const totalTasks = data.reduce(
        (total, item) => total + item.value,
        0
    );

    const completedPercentage =
        totalTasks > 0
            ? Math.round(
                (completedTasks.length / totalTasks) * 100
            )
            : 0;

    const hasTaskData = totalTasks > 0;

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

            {hasTaskData ? (
                <>
                    {/* Chart */}
                    <div className="relative mt-6 h-64">
                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={65}
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

                                <Tooltip
                                    formatter={(value, name) => [
                                        value,
                                        name,
                                    ]}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Center Summary */}
                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                            <p className="text-3xl font-bold text-slate-900">
                                {totalTasks}
                            </p>

                            <p className="text-xs text-slate-500">
                                Total Tasks
                            </p>
                        </div>
                    </div>

                    {/* Completion Summary */}
                    <div className="mb-5 flex items-center justify-center gap-2 rounded-lg bg-emerald-50 px-4 py-3">
                        <CheckCircle2
                            size={17}
                            className="text-emerald-600"
                        />

                        <p className="text-sm font-medium text-emerald-700">
                            {completedPercentage}% completed
                        </p>
                    </div>

                    {/* Legend */}
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
                                            backgroundColor:
                                                COLORS[index],
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
                </>
            ) : (
                /* Empty State */
                <div className="flex h-80 flex-col items-center justify-center text-center">
                    <Circle
                        size={32}
                        className="text-slate-300"
                    />

                    <p className="mt-3 font-medium text-slate-900">
                        No task data yet
                    </p>

                    <p className="mt-1 max-w-xs text-sm text-slate-500">
                        Create tasks to see your task distribution.
                    </p>
                </div>
            )}
        </div>
    );
};

export default TaskAnalytics;
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, } from "recharts";
import { Circle } from "lucide-react";
import { useSelector } from "react-redux";
import { selectCompletedTasks, selectInProgressTasks, selectPendingTasks, } from "../../tasks/taskSelectors";

const COLORS = [
    "#10b981",
    "#f59e0b",
    "#94a3b8",
];

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

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
                <h2 className="font-semibold text-slate-900">
                    Task Analytics
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Overview of your current task distribution.
                </p>
            </div>

            <div className="mt-6 h-64">
                {data.every((item) => item.value === 0) ? (
                    <div className="flex h-64 flex-col items-center justify-center text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                            <Circle
                                size={24}
                                className="text-slate-400"
                            />
                        </div>

                        <h3 className="mt-4 text-sm font-semibold text-slate-900">
                            No task data yet
                        </h3>

                        <p className="mt-1 max-w-sm text-sm text-slate-500">
                            Create tasks to see your task distribution.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mt-6 h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={85}
                                        innerRadius={55}
                                        paddingAngle={3}
                                    >
                                        {data.map((entry, index) => (
                                            <Cell
                                                key={entry.name}
                                                fill={COLORS[index]}
                                            />
                                        ))}
                                    </Pie>

                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
                            {data.map((item, index) => (
                                <div key={item.name}>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="h-2.5 w-2.5 rounded-full"
                                            style={{
                                                backgroundColor: COLORS[index],
                                            }}
                                        />

                                        <span className="text-xs text-slate-500">
                                            {item.name}
                                        </span>
                                    </div>

                                    <p className="mt-1 text-lg font-semibold text-slate-900">
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
                {data.map((item, index) => (
                    <div key={item.name}>
                        <div className="flex items-center gap-2">
                            <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{
                                    backgroundColor: COLORS[index],
                                }}
                            />

                            <span className="text-xs text-slate-500">
                                {item.name}
                            </span>
                        </div>

                        <p className="mt-1 text-lg font-semibold text-slate-900">
                            {item.value}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TaskAnalytics;
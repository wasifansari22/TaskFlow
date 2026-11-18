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
        { name: "Completed", value: completedTasks.length },
        { name: "In Progress", value: inProgressTasks.length },
        { name: "Pending", value: pendingTasks.length },
    ];

    const totalTasks = data.reduce(
        (total, item) => total + item.value,
        0
    );

    const completedPercentage =
        totalTasks > 0
            ? Math.round((completedTasks.length / totalTasks) * 100)
            : 0;

    const hasTaskData = totalTasks > 0;

    return (
        <section className="h-full rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-[#292e3a] dark:bg-[#151821] sm:p-5">
            <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    Task Analytics
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Distribution of your tasks by status.
                </p>
            </div>

            {hasTaskData ? (
                <>
                    <div className="relative mt-4 h-60 sm:h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={68}
                                    outerRadius={94}
                                    paddingAngle={4}
                                    cornerRadius={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index]}
                                        />
                                    ))}
                                </Pie>

                                <Tooltip
                                    position={{ x: 0, y: 0 }}
                                    offset={18}
                                    allowEscapeViewBox={{ x: true, y: true }}
                                    isAnimationActive={false}
                                    contentStyle={{
                                        backgroundColor: "var(--tooltip-bg)",
                                        border: "1px solid var(--tooltip-border)",
                                        borderRadius: "12px",
                                        color: "var(--tooltip-text)",
                                        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                            <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                {totalTasks}
                            </p>

                            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                                Total Tasks
                            </p>
                        </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-500/30 dark:bg-emerald-500/10">
                        <div className="flex items-center gap-2">
                            <CheckCircle2
                                size={18}
                                className="text-emerald-600 dark:text-emerald-400"
                            />

                            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                Completion rate
                            </span>
                        </div>

                        <span className="text-base font-bold tabular-nums text-emerald-700 dark:text-emerald-300">
                            {completedPercentage}%
                        </span>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-2">
                        {data.map((item, index) => (
                            <div
                                key={item.name}
                                className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-[#292e3a] dark:bg-[#1c202b]"
                            >
                                <div className="flex items-center gap-1.5">
                                    <span
                                        className="h-2 w-2 shrink-0 rounded-full"
                                        style={{
                                            backgroundColor: COLORS[index],
                                        }}
                                    />

                                    <span className="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                        {item.name}
                                    </span>
                                </div>

                                <p className="mt-2 text-lg font-bold tabular-nums text-slate-900 dark:text-white">
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex h-80 flex-col items-center justify-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                        <Circle size={24} />
                    </div>

                    <p className="mt-4 font-semibold text-slate-900 dark:text-white">
                        No task data yet
                    </p>

                    <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">
                        Create tasks to see your task distribution.
                    </p>
                </div>
            )}
        </section>
    );
};

export default TaskAnalytics;
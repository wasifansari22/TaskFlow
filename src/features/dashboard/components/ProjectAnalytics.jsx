import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, } from "recharts";
import { FolderKanban, TrendingUp } from "lucide-react";
import { useSelector } from "react-redux";
import { selectDashboardProjects } from "../dashboardSelectors";

const ProjectAnalytics = () => {
    const projects = useSelector(selectDashboardProjects);

    const totalProjects = projects.length;

    const averageProgress =
        totalProjects > 0
            ? Math.round(
                projects.reduce(
                    (total, project) => total + project.progress,
                    0
                ) / totalProjects
            )
            : 0;

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            {/* Header */}
            <div>
                <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                    Project Analytics
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Progress across your active projects.
                </p>
            </div>

            {projects.length === 0 ? (
                /* Empty State */
                <div className="flex h-80 flex-col items-center justify-center text-center">
                    <FolderKanban
                        size={32}
                        className="text-slate-300 dark:text-slate-600"
                    />

                    <p className="mt-3 font-medium text-slate-900 dark:text-slate-100">
                        No project data yet
                    </p>

                    <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">
                        Create projects to see your project progress.
                    </p>
                </div>
            ) : (
                <>
                    {/* Summary */}
                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Total Projects
                            </p>

                            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">
                                {totalProjects}
                            </p>
                        </div>

                        <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
                            <div className="flex items-center gap-1.5">
                                <TrendingUp
                                    size={14}
                                    className="text-blue-600 dark:text-blue-400"
                                />

                                <p className="text-xs text-blue-600 dark:text-blue-400">
                                    Avg. Progress
                                </p>
                            </div>

                            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">
                                {averageProgress}%
                            </p>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="mt-6 h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={projects}
                                layout="vertical"
                                margin={{
                                    top: 5,
                                    right: 10,
                                    left: 10,
                                    bottom: 5,
                                }}
                            >
                                <XAxis
                                    type="number"
                                    domain={[0, 100]}
                                    tick={{
                                        fontSize: 11,
                                        fill: "var(--tooltip-text)",
                                    }}
                                    tickFormatter={(value) => `${value}%`}
                                    axisLine={{ stroke: "var(--tooltip-border)" }}
                                    tickLine={{ stroke: "var(--tooltip-border)" }}
                                />

                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    width={90}
                                    tick={{
                                        fontSize: 11,
                                        fill: "var(--tooltip-text)",
                                    }}
                                    axisLine={{ stroke: "var(--tooltip-border)" }}
                                    tickLine={false}
                                />

                                <Tooltip
                                    position={{ x: 150, y: 0 }}
                                    offset={18}
                                    allowEscapeViewBox={{ x: true, y: true }}
                                    isAnimationActive={false}
                                    contentStyle={{
                                        backgroundColor: "var(--tooltip-bg)",
                                        border: "1px solid var(--tooltip-border)",
                                        borderRadius: "8px",
                                        color: "var(--tooltip-text)",
                                    }}
                                    formatter={(value) => [
                                        `${value}%`,
                                        "Progress",
                                    ]}
                                />

                                <Bar
                                    dataKey="progress"
                                    fill="#2563eb"
                                    radius={[0, 6, 6, 0]}
                                    barSize={24}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProjectAnalytics;
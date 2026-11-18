import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, } from "recharts";
import { FolderKanban, TrendingUp } from "lucide-react";
import { useSelector } from "react-redux";
import { selectDashboardProjects } from "../dashboardSelectors";

const ProjectAnalytics = () => {
    const projects = useSelector(selectDashboardProjects);

    const totalProjects = projects.length;

    const averageProgress = totalProjects > 0 ? Math.round(projects.reduce((total, project) => total + project.progress, 0) / totalProjects) : 0;

    return (
        <section className="h-full rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-[#292e3a] dark:bg-[#151821] sm:p-5">
            <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    Project Analytics
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Progress across your active projects.
                </p>
            </div>

            {projects.length === 0 ? (
                <div className="flex h-80 flex-col items-center justify-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                        <FolderKanban size={24} />
                    </div>

                    <p className="mt-4 font-semibold text-slate-900 dark:text-white">
                        No project data yet
                    </p>

                    <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">
                        Create projects to see your project progress.
                    </p>
                </div>
            ) : (
                <>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-[#292e3a] dark:bg-[#1c202b]">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Active Projects
                            </p>

                            <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
                                {totalProjects}
                            </p>
                        </div>

                        <div className="rounded-lg border border-indigo-100 bg-indigo-50/70 p-3 dark:border-indigo-500/30 dark:bg-indigo-500/10">
                            <div className="flex items-center gap-1.5">
                                <TrendingUp
                                    size={14}
                                    className="text-indigo-600 dark:text-indigo-400"
                                />

                                <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                                    Avg. Progress
                                </p>
                            </div>

                            <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
                                {averageProgress}%
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 h-56 min-w-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={projects}
                                layout="vertical"
                                margin={{
                                    top: 5,
                                    right: 12,
                                    left: 4,
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
                                    axisLine={{
                                        stroke: "var(--tooltip-border)",
                                    }}
                                    tickLine={false}
                                />

                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    width={90}
                                    tick={{
                                        fontSize: 11,
                                        fill: "var(--tooltip-text)",
                                    }}
                                    axisLine={false}
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
                                        borderRadius: "12px",
                                        color: "var(--tooltip-text)",
                                        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                                    }}
                                    formatter={(value) => [
                                        `${value}%`,
                                        "Progress",
                                    ]}
                                />

                                <Bar
                                    dataKey="progress"
                                    fill="#6366f1"
                                    background={{
                                        fill: "var(--tooltip-border)",
                                        radius: 6,
                                    }}
                                    radius={[0, 6, 6, 0]}
                                    barSize={22}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* TODO: Pending
                    <div className="rounded-lg border border-indigo-100 bg-indigo-50/70 p-3 dark:border-indigo-500/30 dark:bg-indigo-500/10">
                        <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                            Completion Rate - Coming Soon
                        </p>

                        <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
                            {totalProjects} - Functionality Pending...
                        </p>
                    </div> */}
                </>
            )}
        </section>
    );
};

export default ProjectAnalytics;
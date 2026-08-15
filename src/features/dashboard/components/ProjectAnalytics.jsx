import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, } from "recharts";
import { useSelector } from "react-redux";
import { selectDashboardProjects } from "../dashboardSelectors";

const ProjectAnalytics = () => {
    const projects = useSelector(selectDashboardProjects);

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
                <h2 className="font-semibold text-slate-900">
                    Project Progress
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Progress across your active projects.
                </p>
            </div>

            <div className="mt-6 h-64">
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
                            tick={{ fontSize: 11 }}
                            tickFormatter={(value) => `${value}%`}
                        />

                        <YAxis
                            type="category"
                            dataKey="name"
                            width={90}
                            tick={{ fontSize: 11 }}
                        />

                        <Tooltip
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
        </div>
    );
}

export default ProjectAnalytics;
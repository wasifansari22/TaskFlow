import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

const StatCard = ({ title, value, description, icon: Icon, iconStyle = "bg-blue-50 text-blue-600", to = "#", }) => {
    return (
        <Link
            to={to}
            className="group block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
            <div className="flex items-start justify-between">
                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconStyle}`}
                >
                    <Icon size={20} strokeWidth={2} />
                </div>

                <ArrowUpRight
                    size={18}
                    className="text-slate-400 transition group-hover:text-blue-600"
                />
            </div>

            <div className="mt-4">
                <p className="text-sm font-medium text-slate-500">
                    {title}
                </p>

                <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                    {value}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                    {description}
                </p>
            </div>
        </Link>
    );
};

export default StatCard;
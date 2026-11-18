import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

const StatCard = ({ title, value, description, icon: Icon, iconStyle = "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400", to = "#", }) => {
    return (
        <Link
            to={to}
            className="group relative flex min-w-0 flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-[#292e3a] dark:bg-[#151821] dark:hover:border-indigo-500/60 sm:p-5"
        >
            {/* Card heading */}
            <div className="flex items-start justify-between gap-3">
                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconStyle}`}
                >
                    {Icon && <Icon size={21} strokeWidth={1.8} />}
                </div>

                <ArrowUpRight
                    size={18}
                    className="text-slate-300 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-indigo-500 dark:text-slate-600 dark:group-hover:text-indigo-400"
                />
            </div>

            {/* Card information */}
            <div className="mt-5">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {title}
                </p>

                <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {value}
                </p>

                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {description}
                </p>
            </div>
        </Link>
    );
};

export default StatCard;
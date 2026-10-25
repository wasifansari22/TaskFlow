import { ArrowLeft, Home, SearchX } from "lucide-react";
import { Link, useNavigate } from "react-router";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <div className="w-full max-w-lg text-center">
                {/* Icon */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                    <SearchX size={30} />
                </div>

                {/* Error Code */}
                <p className="mt-6 text-7xl font-bold tracking-tight text-blue-600">
                    404
                </p>

                {/* Message */}
                <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                    Page not found
                </h1>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
                    The page you're looking for doesn't exist or may have
                    been moved.
                </p>

                {/* Actions */}
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                    >
                        <ArrowLeft size={17} />
                    </button>

                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                    >
                        <Home size={17} />
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
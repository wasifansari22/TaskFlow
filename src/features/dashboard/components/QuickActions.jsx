import { Link } from "react-router";
import { Plus, CheckSquare, FolderPlus, } from "lucide-react";

function QuickActions() {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
                <h2 className="font-semibold text-slate-900">
                    Quick Actions
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Jump straight into your workflow.
                </p>
            </div>

            <div className="mt-6 space-y-3">
                <Link
                    to="/tasks"
                    className="flex items-center justify-between rounded-lg border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <CheckSquare size={18} />
                        </div>

                        <div>
                            <p className="text-sm font-medium text-slate-900">
                                New Task
                            </p>

                            <p className="text-xs text-slate-500">
                                Add something to your task list
                            </p>
                        </div>
                    </div>

                    <Plus size={18} className="text-slate-400" />
                </Link>

                <Link
                    to="/projects"
                    className="flex items-center justify-between rounded-lg border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                            <FolderPlus size={18} />
                        </div>

                        <div>
                            <p className="text-sm font-medium text-slate-900">
                                New Project
                            </p>

                            <p className="text-xs text-slate-500">
                                Start organizing your work
                            </p>
                        </div>
                    </div>

                    <Plus size={18} className="text-slate-400" />
                </Link>
            </div>
        </div>
    );
}

export default QuickActions;
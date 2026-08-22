import { User, Palette, Bell, ListTodo } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme, toggleNotification, setDefaultPriority, setDefaultStatus, resetSettings } from "../features/settings/settingsSlice";
import { selectTheme, selectNotifications, selectDefaultPriority, selectDefaultStatus } from "../features/settings/settingsSelectors";

const Settings = () => {
    const dispatch = useDispatch();
    const theme = useSelector(selectTheme);
    const notifications = useSelector(selectNotifications);
    const defaultPriority = useSelector(selectDefaultPriority);
    const defaultStatus = useSelector(selectDefaultStatus);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    return (
        <div className="mx-auto w-full max-w-5xl space-y-8">
            {/* Header */}
            <section>
                <p className="text-sm font-medium text-blue-600">
                    Workspace
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                    Settings
                </h1>

                <p className="mt-2 text-slate-600">
                    Manage your profile and TaskFlow preferences.
                </p>
            </section>

            {/* Profile */}
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-200 p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <User size={19} />
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-900">
                            Profile
                        </h2>

                        <p className="text-sm text-slate-500">
                            Your workspace profile information.
                        </p>
                    </div>
                </div>

                <div className="grid gap-5 p-5 sm:grid-cols-2">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Name
                        </p>

                        <p className="mt-1 font-medium text-slate-900">
                            Wasif
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Role
                        </p>

                        <p className="mt-1 font-medium text-slate-900">
                            Developer
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Workspace
                        </p>

                        <p className="mt-1 font-medium text-slate-900">
                            Personal workspace
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Account
                        </p>

                        <p className="mt-1 font-medium text-emerald-600">
                            Active
                        </p>
                    </div>
                </div>
            </section>

            {/* Appearance */}
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-200 p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                        <Palette size={19} />
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-900">
                            Appearance
                        </h2>

                        <p className="text-sm text-slate-500">
                            Customize how TaskFlow looks.
                        </p>
                    </div>
                </div>

                <div className="p-5">
                    <p className="text-sm font-medium text-slate-700">
                        Theme
                    </p>

                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        {["light", "dark", "system"].map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => dispatch(setTheme(option))}
                                className={`rounded-lg border px-4 py-3 text-left text-sm font-medium capitalize transition ${theme === option
                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                    : "border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Notifications */}
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-200 p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                        <Bell size={19} />
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-900">
                            Notifications
                        </h2>

                        <p className="text-sm text-slate-500">
                            Control which updates you receive.
                        </p>
                    </div>
                </div>

                <div className="divide-y divide-slate-100">
                    {[
                        {
                            key: "taskUpdates",
                            title: "Task updates",
                            description: "Get notified when a task is updated.",
                        },
                        {
                            key: "deadlineReminders",
                            title: "Deadline reminders",
                            description: "Receive reminders about upcoming deadlines.",
                        },
                        {
                            key: "projectUpdates",
                            title: "Project updates",
                            description: "Get notified about project changes.",
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className="flex items-center justify-between gap-4 p-5"
                        >
                            <div>
                                <p className="text-sm font-medium text-slate-900">
                                    {item.title}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                    {item.description}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => dispatch(toggleNotification(item.key))}
                                className={`relative h-6 w-11 shrink-0 rounded-full transition-all cursor-pointer ${notifications[item.key]
                                    ? "bg-blue-600"
                                    : "bg-slate-300"
                                    }`}
                                aria-label={`Toggle ${item.title}`}
                            >
                                <span
                                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${notifications[item.key] ? "left-6" : "left-1"
                                        }`}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Task Preferences */}
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-200 p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        <ListTodo size={19} />
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-900">
                            Task Preferences
                        </h2>

                        <p className="text-sm text-slate-500">
                            Configure your default task behavior.
                        </p>
                    </div>
                </div>

                <div className="grid gap-5 p-5 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="default-priority"
                            className="mb-1.5 block text-sm font-medium text-slate-700"
                        >
                            Default priority
                        </label>

                        <select
                            id="default-priority"
                            value={defaultPriority}
                            onChange={(event) => dispatch(setDefaultPriority(event.target.value))}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="default-status"
                            className="mb-1.5 block text-sm font-medium text-slate-700"
                        >
                            Default status
                        </label>

                        <select
                            id="default-status"
                            value={defaultStatus}
                            onChange={(event) => dispatch(setDefaultStatus(event.target.value))}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                        </select>
                    </div>
                </div>
            </section>

            <button
                type="button"
                onClick={() => dispatch(resetSettings())}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-white transition  bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
                Reset Settings
            </button>
        </div>
    );
};

export default Settings;
import Counter from "../features/counter/Counter";

function Dashboard() {
    return (
        <div>
            <p className="text-sm font-medium text-blue-600">
                TaskFlow
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                Dashboard
            </h1>

            <p className="mt-2 text-slate-600">
                Welcome to your TaskFlow dashboard.
            </p>

            <Counter />
        </div>
    );
}

export default Dashboard;
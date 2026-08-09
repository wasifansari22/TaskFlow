import { useDispatch, useSelector } from "react-redux";
import { increment, decrement } from "./counterSlice";

function Counter() {
    const count = useSelector((state) => state.counter.value);
    const dispatch = useDispatch();

    return (
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
                Redux Counter
            </h2>

            <p className="mt-4 text-4xl font-bold text-blue-600">
                {count}
            </p>

            <div className="mt-6 flex gap-3">
                <button
                    onClick={() => dispatch(decrement())}
                    className="rounded-lg bg-slate-200 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-300"
                >
                    −
                </button>

                <button
                    onClick={() => dispatch(increment())}
                    className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-500"
                >
                    +
                </button>
            </div>
        </div>
    );
}

export default Counter;
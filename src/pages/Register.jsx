import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { register } from "../features/auth/authSlice";

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isSubmittingRef = useRef(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isSubmittingRef.current) {
            return;
        }

        setError("");

        if (
            !firstName.trim() ||
            !lastName.trim() ||
            !username.trim() ||
            !email.trim() ||
            !password ||
            !passwordConfirm
        ) {
            setError("Please fill in all fields.");
            return;
        }

        if (password !== passwordConfirm) {
            setError("Passwords do not match.");
            return;
        }

        isSubmittingRef.current = true;
        setIsSubmitting(true);

        try {
            await dispatch(
                register({
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    username: username.trim(),
                    email: email.trim(),
                    password,
                    passwordConfirm,
                })
            ).unwrap();

            navigate("/", { replace: true });
        } catch (error) {
            setError(
                typeof error === "string"
                    ? error
                    : "Registration failed."
            );
        } finally {
            isSubmittingRef.current = false;
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
                        T
                    </div>

                    <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
                        Create your TaskFlow account
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Create an account to manage your tasks and projects.
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="first-name"
                                    className="mb-1.5 block text-sm font-medium text-slate-700"
                                >
                                    First name
                                </label>

                                <input
                                    id="first-name"
                                    type="text"
                                    value={firstName}
                                    onChange={(event) =>
                                        setFirstName(event.target.value)
                                    }
                                    autoComplete="given-name"
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="last-name"
                                    className="mb-1.5 block text-sm font-medium text-slate-700"
                                >
                                    Last name
                                </label>

                                <input
                                    id="last-name"
                                    type="text"
                                    value={lastName}
                                    onChange={(event) =>
                                        setLastName(event.target.value)
                                    }
                                    autoComplete="family-name"
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="username"
                                className="mb-1.5 block text-sm font-medium text-slate-700"
                            >
                                Username
                            </label>

                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(event) =>
                                    setUsername(event.target.value)
                                }
                                autoComplete="username"
                                placeholder="Choose a username"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1.5 block text-sm font-medium text-slate-700"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                autoComplete="email"
                                placeholder="Enter your email"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1.5 block text-sm font-medium text-slate-700"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                autoComplete="new-password"
                                placeholder="Create a password"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password-confirm"
                                className="mb-1.5 block text-sm font-medium text-slate-700"
                            >
                                Confirm password
                            </label>

                            <input
                                id="password-confirm"
                                type="password"
                                value={passwordConfirm}
                                onChange={(event) =>
                                    setPasswordConfirm(event.target.value)
                                }
                                autoComplete="new-password"
                                placeholder="Confirm your password"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {error && (
                            <p className="rounded-lg bg-rose-50 px-3 py-2.5 text-sm text-rose-600">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting
                                ? "Creating account..."
                                : "Create account"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-medium text-blue-600 hover:text-blue-700"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
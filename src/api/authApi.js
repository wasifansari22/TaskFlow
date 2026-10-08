const API_BASE_URL = "http://127.0.0.1:8000/api";

export const loginUser = async (identifier, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            identifier,
            password,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Login failed."
        );
    }

    return data;
};

export const registerUser = async ({
    firstName,
    lastName,
    username,
    email,
    password,
    passwordConfirm,
}) => {
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            username,
            email,
            password,
            password_confirm: passwordConfirm,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            Object.values(data)
                .flat()
                .join(" ")
            || "Registration failed."
        );
    }

    return data;
};
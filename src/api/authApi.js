const API_BASE_URL = "http://127.0.0.1:8000/api";

export const loginUser = async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
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
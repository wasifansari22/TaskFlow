const API_BASE_URL = "http://127.0.0.1:8000/api";

export const getTasks = async () => {
    const token = localStorage.getItem("taskflow-token");

    const response = await fetch(`${API_BASE_URL}/tasks/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Failed to fetch tasks."
        );
    }

    return data;
};
const API_BASE_URL = "http://127.0.0.1:8000/api";

const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem("taskflow-token");

    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        headers.Authorization = `Token ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        throw new Error(
            errorData.detail ||
            errorData.message ||
            "Something went wrong with the API request."
        );
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
};

export default apiRequest;
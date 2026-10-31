const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api").replace(/\/+$/, "");

export class ApiError extends Error {
    constructor(message, status = null, data = null) {
        super(message);

        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}

const getErrorMessage = (data, status) => {
    if (typeof data?.detail === "string") {
        return data.detail;
    }

    if (typeof data?.message === "string") {
        return data.message;
    }

    if (data && typeof data === "object") {
        const fieldErrors = Object.entries(data)
            .map(([field, errors]) => {
                const messages = Array.isArray(errors)
                    ? errors.join(" ")
                    : typeof errors === "string"
                        ? errors
                        : "";

                return messages ? `${field}: ${messages}` : "";
            })
            .filter(Boolean);

        if (fieldErrors.length > 0) {
            return fieldErrors.join(" ");
        }
    }

    if (status === 400) {
        return "Please check the information you entered.";
    }

    if (status === 401) {
        return "Your session is invalid or has expired. Please log in again.";
    }

    if (status === 403) {
        return "You do not have permission to perform this action.";
    }

    if (status === 404) {
        return "The requested resource could not be found.";
    }

    if (status === 500) {
        return "The server encountered an error. Please try again later.";
    }

    if (status >= 500) {
        return "The server is temporarily unavailable. Please try again later.";
    }

    return "Something went wrong with the API request.";
};

const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem("taskflow-token");

    const headers = {
        ...options.headers,
    };

    // Add JSON content type when a request has a body,
    // unless the caller has already supplied a content type.
    if (
        options.body &&
        !Object.keys(headers).some(
            (key) => key.toLowerCase() === "content-type"
        )
    ) {
        headers["Content-Type"] = "application/json";
    }

    const hasAuthorizationHeader = Object.keys(headers).some(
        (key) => key.toLowerCase() === "authorization"
    );

    if (token && !hasAuthorizationHeader) {
        headers.Authorization = `Token ${token}`;
    }

    let response;

    try {
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });
    } catch (error) {
        if (error.name === "AbortError") {
            throw error;
        }

        throw new ApiError("Unable to connect to TaskFlow's server. Check your connection and try again.");
    }

    const contentType = response.headers.get("content-type") || "";

    let responseData = null;

    if (response.status !== 204 && response.status !== 205) {
        if (contentType.includes("application/json")) {
            responseData = await response.json().catch(() => null);
        } else {
            responseData = await response.text().catch(() => "");
        }
    }

    if (!response.ok) {
        throw new ApiError(
            getErrorMessage(responseData, response.status),
            response.status,
            responseData
        );
    }

    return responseData;
};

export default apiRequest;
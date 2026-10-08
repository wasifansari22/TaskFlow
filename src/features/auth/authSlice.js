import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "../../api/authApi";

const savedAuth = JSON.parse(localStorage.getItem("taskflow-auth") || "null");

const initialState = savedAuth || {
    isAuthenticated: false,
    user: null,
    token: null,
    status: "idle",
    error: null,
};

export const login = createAsyncThunk(
    "auth/login",
    async ({ identifier, password }, thunkAPI) => {
        try {
            return await loginUser(identifier, password);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.message === "Failed to fetch"
                    ? "Unable to connect to the server. Please make sure the server is running and try again."
                    : error.message
            );
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.status = "idle";
            state.error = null;

            localStorage.removeItem("taskflow-auth");
            localStorage.removeItem("taskflow-token");
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })

            .addCase(login.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;

                localStorage.setItem(
                    "taskflow-token",
                    action.payload.token
                );

                localStorage.setItem(
                    "taskflow-auth",
                    JSON.stringify({
                        isAuthenticated: true,
                        user: action.payload.user,
                        token: action.payload.token,
                        status: "succeeded",
                        error: null,
                    })
                );
            })

            .addCase(login.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
            })

            .addCase(register.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;

                localStorage.setItem(
                    "taskflow-token",
                    action.payload.token
                );

                localStorage.setItem(
                    "taskflow-auth",
                    JSON.stringify({
                        isAuthenticated: true,
                        user: action.payload.user,
                        token: action.payload.token,
                        status: "succeeded",
                        error: null,
                    })
                );
            });
    },
});

export const register = createAsyncThunk(
    "auth/register",
    async (
        {
            firstName,
            lastName,
            username,
            email,
            password,
            passwordConfirm,
        },
        thunkAPI
    ) => {
        try {
            return await registerUser({
                firstName,
                lastName,
                username,
                email,
                password,
                passwordConfirm,
            });
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.message === "Failed to fetch"
                    ? "Unable to connect to the server. Please make sure the server is running and try again."
                    : error.message
            );
        }
    }
);

export const { logout } = authSlice.actions;
export default authSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser } from "../../api/authApi";

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
    async ({ username, password }, thunkAPI) => {
        try {
            return await loginUser(username, password);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
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
            })

            .addCase(login.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
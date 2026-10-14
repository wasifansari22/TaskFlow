
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiRequest from "../../api/apiClient";

export const getNotificationOwnerKey = (auth) => {
    const token = auth?.token;
    const user = auth?.user;
    const userId = user?.id ?? user?.username ?? user?.email;

    if (!token || userId == null) return null;

    // Including the token distinguishes authenticated sessions.
    return `${userId}:${token}`;
};

const normalizeNotification = (notification) => ({
    ...notification,
    createdAt: notification.created_at ?? notification.createdAt,
    relatedTaskId: notification.related_task ?? notification.relatedTaskId ?? null,
    relatedProjectId:
        notification.related_project ?? notification.relatedProjectId ?? null,
});

const getTokenForOwner = (getState, expectedOwnerKey) => {
    const auth = getState().auth;
    const ownerKey = getNotificationOwnerKey(auth);

    if (!auth?.token || !ownerKey || ownerKey !== expectedOwnerKey) {
        throw new Error("Your session has changed. Please try again.");
    }

    return auth.token;
};

const apiOptions = (token, method, body) => ({
    method,
    headers: {
        Authorization: `Token ${token}`,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
});

const ownerKeyFromArg = (arg) =>
    typeof arg === "string" ? arg : arg?.ownerKey;

const prepareOwner = (state, ownerKey) => {
    if (state.ownerKey !== ownerKey) {
        state.ownerKey = ownerKey;
        state.notifications = [];
    }
    state.status = "loading";
    state.error = null;
};

const setFailure = (state, action) => {
    state.status = "failed";
    state.error =
        action.payload ??
        action.error?.message ??
        "Unable to load notifications.";
};

export const fetchNotificationsAsync = createAsyncThunk(
    "notifications/fetchAll",
    async (ownerKey, { getState, rejectWithValue }) => {
        try {
            const token = getTokenForOwner(getState, ownerKey);
            const response = await apiRequest(
                "/notifications/",
                apiOptions(token, "GET")
            );

            const items = Array.isArray(response)
                ? response
                : response?.results;

            if (!Array.isArray(items)) {
                throw new Error("The notifications API returned an unexpected response.");
            }

            return {
                ownerKey,
                notifications: items.map(normalizeNotification),
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createNotificationAsync = createAsyncThunk(
    "notifications/create",
    async (
        {
            ownerKey,
            title,
            message,
            type,
            relatedTaskId = null,
            relatedProjectId = null,
        },
        { getState, rejectWithValue }
    ) => {
        try {
            const token = getTokenForOwner(getState, ownerKey);
            const response = await apiRequest(
                "/notifications/",
                apiOptions(token, "POST", {
                    title,
                    message,
                    type,
                    related_task: relatedTaskId,
                    related_project: relatedProjectId,
                })
            );

            return {
                ownerKey,
                notification: normalizeNotification(response),
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const markNotificationAsReadAsync = createAsyncThunk(
    "notifications/markRead",
    async ({ ownerKey, id }, { getState, rejectWithValue }) => {
        try {
            const token = getTokenForOwner(getState, ownerKey);
            const response = await apiRequest(
                `/notifications/${id}/`,
                apiOptions(token, "PATCH", { read: true })
            );

            return {
                ownerKey,
                notification: normalizeNotification(response),
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const markAllNotificationsReadAsync = createAsyncThunk(
    "notifications/markAllRead",
    async (ownerKey, { getState, rejectWithValue }) => {
        try {
            const token = getTokenForOwner(getState, ownerKey);
            await apiRequest(
                "/notifications/mark-all-read/",
                apiOptions(token, "POST", {})
            );

            return { ownerKey };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteNotificationAsync = createAsyncThunk(
    "notifications/delete",
    async ({ ownerKey, id }, { getState, rejectWithValue }) => {
        try {
            const token = getTokenForOwner(getState, ownerKey);
            await apiRequest(
                `/notifications/${id}/`,
                apiOptions(token, "DELETE")
            );

            return { ownerKey, id };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const clearNotificationsAsync = createAsyncThunk(
    "notifications/clearAll",
    async (ownerKey, { getState, rejectWithValue }) => {
        try {
            const token = getTokenForOwner(getState, ownerKey);
            await apiRequest(
                "/notifications/clear-all/",
                apiOptions(token, "POST", {})
            );

            return { ownerKey };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    notifications: [],
    ownerKey: null,
    status: "idle",
    error: null,
};

const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        resetNotifications: (state) => {
            state.notifications = [];
            state.ownerKey = null;
            state.status = "idle";
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            // Clear notifications whenever the authenticated account changes.
            .addCase("auth/login/fulfilled", (state, action) => {
                state.notifications = [];
                state.ownerKey = getNotificationOwnerKey({
                    user: action.payload.user,
                    token: action.payload.token,
                });
                state.status = "idle";
                state.error = null;
            })
            .addCase("auth/register/fulfilled", (state, action) => {
                state.notifications = [];
                state.ownerKey = getNotificationOwnerKey({
                    user: action.payload.user,
                    token: action.payload.token,
                });
                state.status = "idle";
                state.error = null;
            })
            .addCase("auth/logout", (state) => {
                state.notifications = [];
                state.ownerKey = null;
                state.status = "idle";
                state.error = null;
            })
            .addCase("auth/login/rejected", (state) => {
                state.notifications = [];
                state.ownerKey = null;
                state.status = "idle";
                state.error = null;
            })

            .addCase(fetchNotificationsAsync.pending, (state, action) => {
                prepareOwner(state, ownerKeyFromArg(action.meta.arg));
            })
            .addCase(fetchNotificationsAsync.fulfilled, (state, action) => {
                if (state.ownerKey !== action.payload.ownerKey) return;
                state.notifications = action.payload.notifications;
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(fetchNotificationsAsync.rejected, (state, action) => {
                if (state.ownerKey !== ownerKeyFromArg(action.meta.arg)) return;
                setFailure(state, action);
            })

            .addCase(createNotificationAsync.pending, (state, action) => {
                prepareOwner(state, action.meta.arg.ownerKey);
            })
            .addCase(createNotificationAsync.fulfilled, (state, action) => {
                if (state.ownerKey !== action.payload.ownerKey) return;
                state.notifications.unshift(action.payload.notification);
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(createNotificationAsync.rejected, (state, action) => {
                if (state.ownerKey !== action.meta.arg.ownerKey) return;
                setFailure(state, action);
            })

            .addCase(markNotificationAsReadAsync.pending, (state, action) => {
                prepareOwner(state, action.meta.arg.ownerKey);
            })
            .addCase(markNotificationAsReadAsync.fulfilled, (state, action) => {
                if (state.ownerKey !== action.payload.ownerKey) return;
                const index = state.notifications.findIndex(
                    (item) => item.id === action.payload.notification.id
                );
                if (index !== -1) {
                    state.notifications[index] = action.payload.notification;
                }
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(markNotificationAsReadAsync.rejected, (state, action) => {
                if (state.ownerKey !== action.meta.arg.ownerKey) return;
                setFailure(state, action);
            })

            .addCase(markAllNotificationsReadAsync.pending, (state, action) => {
                prepareOwner(state, action.meta.arg);
            })
            .addCase(markAllNotificationsReadAsync.fulfilled, (state, action) => {
                if (state.ownerKey !== action.payload.ownerKey) return;
                state.notifications.forEach((item) => {
                    item.read = true;
                });
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(markAllNotificationsReadAsync.rejected, (state, action) => {
                if (state.ownerKey !== action.meta.arg) return;
                setFailure(state, action);
            })

            .addCase(deleteNotificationAsync.pending, (state, action) => {
                prepareOwner(state, action.meta.arg.ownerKey);
            })
            .addCase(deleteNotificationAsync.fulfilled, (state, action) => {
                if (state.ownerKey !== action.payload.ownerKey) return;
                state.notifications = state.notifications.filter(
                    (item) => item.id !== action.payload.id
                );
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(deleteNotificationAsync.rejected, (state, action) => {
                if (state.ownerKey !== action.meta.arg.ownerKey) return;
                setFailure(state, action);
            })

            .addCase(clearNotificationsAsync.pending, (state, action) => {
                prepareOwner(state, action.meta.arg);
            })
            .addCase(clearNotificationsAsync.fulfilled, (state, action) => {
                if (state.ownerKey !== action.payload.ownerKey) return;
                state.notifications = [];
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(clearNotificationsAsync.rejected, (state, action) => {
                if (state.ownerKey !== action.meta.arg) return;
                setFailure(state, action);
            });
    },
});

export const { resetNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
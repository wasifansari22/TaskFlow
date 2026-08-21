import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notifications: [],
};

const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
        },
        markNotificationAsRead: (state, action) => {
            const notification = state.notifications.find((notification) => notification.id === action.payload);
            if (!notification) return;
            notification.read = true;
        },
        markAllNotificationAsRead: (state) => {
            state.notifications.forEach((notification) => {
                notification.read = true;
            });
        },
        deleteNotification: (state, action) => {
            state.notifications = state.notifications.filter((notification) => notification.id !== action.payload);
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },
    },
});

export const {addNotification, markNotificationAsRead, markAllNotificationAsRead, deleteNotification, clearNotifications} = notificationSlice.actions;
export default notificationSlice.reducer;
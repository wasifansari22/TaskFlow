export const selectAllNotifications = (state) => state.notifications.notifications;

export const selectUnreadNotifications = (state) =>
    state.notifications.notifications.filter((notification) => !notification.read);

export const selectUnreadNotificationCount = (state) =>
    state.notifications.notifications.filter((notification) => !notification.read).length;

export const selectRecentNotifications = (state) => state.notifications.notifications.slice(0, 5);
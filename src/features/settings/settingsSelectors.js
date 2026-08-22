export const selectTheme = (state) => state.settings.theme;

export const selectNotifications = (state) => state.settings.notifications;

export const selectTaskPreferences = (state) => state.settings.taskPreferences;

export const selectDefaultPriority = (state) => state.settings.taskPreferences.defaultPriority;

export const selectDefaultStatus = (state) => state.settings.taskPreferences.defaultStatus;
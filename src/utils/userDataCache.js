// One consistent key per account
const getUserDataKey = (userId) => `taskflow-data-${userId}`;
const readUserDataCache = (userId) => {
    if (userId == null) {
        return null;
    }

    try {
        const saved = localStorage.getItem(getUserDataKey(userId));
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        console.error("Unable to read TaskFlow data cache:", error);
        return null;
    }
};

const saveUserDataCache = (userId, data) => {
    if (userId == null) return;

    try {
        localStorage.setItem(
            getUserDataKey(userId),
            JSON.stringify(data)
        );
    } catch (error) {
        console.error("Unable to save TaskFlow data cache:", error);
    }
};

const removeUserDataCache = (userId) => {
    if (userId == null) return;

    try {
        localStorage.removeItem(getUserDataKey(userId));
    } catch (error) {
        console.error("Unable to remove TaskFlow data cache:", error);
    }
};

export { getUserDataKey, readUserDataCache, saveUserDataCache, removeUserDataCache, };

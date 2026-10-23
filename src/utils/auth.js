export const saveToken = (token) => {
    if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user_token", token);
    }
};

export const getToken = () => {
    return localStorage.getItem("token") || localStorage.getItem("user_token") || null;
};

export const clearToken = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_token");
    localStorage.removeItem("user");
    localStorage.removeItem("dev_bypass");
};

export const saveUser = (user) => {
    if (user) {
        localStorage.setItem("user", JSON.stringify(user));
    }
};

export const getUser = () => {
    try {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
};

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser, getMe } from "../../services/auth.api";
import { getToken, saveToken, clearToken, saveUser, getUser } from "../../utils/auth";

export const loginAsync = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const res = await loginUser(credentials);
            if (res.data?.token) {
                saveToken(res.data.token);
            }
            if (res.data?.user) {
                saveUser(res.data.user);
            }
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Login failed");
        }
    }
);

export const registerAsync = createAsyncThunk(
    "auth/register",
    async (data, { rejectWithValue }) => {
        try {
            const res = await registerUser(data);
            if (res.data?.token) {
                saveToken(res.data.token);
            }
            if (res.data?.user) {
                saveUser(res.data.user);
            }
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Registration failed");
        }
    }
);

export const getMeAsync = createAsyncThunk(
    "auth/getMe",
    async (_, { rejectWithValue }) => {
        try {
            const token = getToken();
            if (!token) throw new Error("No token");
            const res = await getMe();
            if (res.data) {
                saveUser(res.data);
            }
            return res.data;
        } catch (err) {
            clearToken();
            return rejectWithValue(err.response?.data?.message || "Failed to load user");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: getUser() || null,
        token: getToken() || null,
        loading: false,
        error: null,
        isAuthenticated: !!getToken(),
    },
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.error = null;
            if (action.payload.token) saveToken(action.payload.token);
            if (action.payload.user) saveUser(action.payload.user);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            clearToken();
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(registerAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
            })
            .addCase(registerAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })
            // Login
            .addCase(loginAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
            })
            .addCase(loginAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })
            // GetMe
            .addCase(getMeAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMeAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(getMeAsync.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            });
    },
});

export const { logout, clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;

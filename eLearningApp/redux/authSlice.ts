import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../api";

// Define the user type
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Define initial state
interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk<
  { user: User; token: string },
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${api}/auth/login`, { email, password }, {
      withCredentials: true, // important for sending cookies
    });
    if (res.data.success) {
      return {
        user: res.data.user,
        token: res.data.token,
      };
    } else {
      return rejectWithValue(res.data.message || "Login failed");
    }
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Login error");
  }
});

// Logout thunk
export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, thunkAPI) => {
  await axios.post(`${api}/auth/logout`, {}, {
    withCredentials: true,
  });
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    Logout(state) {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { setUser, setToken, Logout } = authSlice.actions;
export default authSlice.reducer;

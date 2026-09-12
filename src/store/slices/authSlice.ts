import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginCredentials, RegisterPayload, User } from '../../types/auth';
import { generateMockJWT, isJWTValid, decodeJWT } from '../../utils/jwt';

const AUTH_TOKEN_KEY = 'postpulse_auth_token_v1';
const AUTH_USER_KEY = 'postpulse_auth_user_v1';

// Pre-seeded demo accounts
export const DEMO_ADMIN_USER: User = {
  id: 'user-admin-1',
  name: 'Ayush Yadav (Admin)',
  email: 'admin@postpulse.io',
  role: 'admin',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  createdAt: '2026-01-01T00:00:00.000Z',
};

export const DEMO_STANDARD_USER: User = {
  id: 'user-standard-1',
  name: 'Sarah Connor (User)',
  email: 'user@postpulse.io',
  role: 'user',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  createdAt: '2026-01-15T00:00:00.000Z',
};

const registeredUsersStore: User[] = [DEMO_ADMIN_USER, DEMO_STANDARD_USER];

// Initial hydration from LocalStorage
const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
const storedUserJson = localStorage.getItem(AUTH_USER_KEY);

let initialUser: User | null = null;
let initialToken: string | null = null;

if (storedToken && isJWTValid(storedToken)) {
  initialToken = storedToken;
  if (storedUserJson) {
    try {
      initialUser = JSON.parse(storedUserJson);
    } catch {
      const payload = decodeJWT(storedToken);
      if (payload) {
        initialUser = {
          id: payload.userId,
          name: payload.name,
          email: payload.email,
          role: payload.role,
          createdAt: new Date().toISOString(),
        };
      }
    }
  }
} else {
  // Default to pre-seeded Admin session for smooth initial demo experience
  initialUser = DEMO_ADMIN_USER;
  initialToken = generateMockJWT(DEMO_ADMIN_USER);
  localStorage.setItem(AUTH_TOKEN_KEY, initialToken);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(initialUser));
}

const initialState: AuthState = {
  user: initialUser,
  token: initialToken,
  isAuthenticated: !!initialToken && isJWTValid(initialToken),
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginCredentials>) => {
      const { email, password } = action.payload;

      // Find matching user
      let matchedUser = registeredUsersStore.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      // If user not in store but demo password is provided, fallback match
      if (!matchedUser) {
        if (email.toLowerCase().includes('admin')) {
          matchedUser = DEMO_ADMIN_USER;
        } else if (email.toLowerCase().includes('user')) {
          matchedUser = DEMO_STANDARD_USER;
        }
      }

      if (!matchedUser) {
        state.error = 'Invalid email or password. Please try demo accounts.';
        state.isAuthenticated = false;
        return;
      }

      if (password && password.length < 4) {
        state.error = 'Password must be at least 4 characters.';
        state.isAuthenticated = false;
        return;
      }

      // Generate JWT
      const token = generateMockJWT(matchedUser);

      state.user = matchedUser;
      state.token = token;
      state.isAuthenticated = true;
      state.error = null;

      // Persist in LocalStorage
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(matchedUser));
    },

    register: (state, action: PayloadAction<RegisterPayload>) => {
      const { name, email, role } = action.payload;

      if (registeredUsersStore.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
        state.error = 'An account with this email address already exists.';
        return;
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        name: name.trim() || 'New User',
        email: email.trim(),
        role: role || 'user',
        createdAt: new Date().toISOString(),
      };

      registeredUsersStore.push(newUser);

      const token = generateMockJWT(newUser);
      state.user = newUser;
      state.token = token;
      state.isAuthenticated = true;
      state.error = null;

      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    },

    clearAuthError: (state) => {
      state.error = null;
    },

    checkTokenValidity: (state) => {
      if (state.token && !isJWTValid(state.token)) {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = 'Your session token has expired. Please sign in again.';
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
      }
    },
  },
});

export const { login, register, logout, clearAuthError, checkTokenValidity } = authSlice.actions;
export default authSlice.reducer;

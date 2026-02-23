**Statement:** Once the folder I belong to (including file structure, functional positioning, etc.) changes, please update me.

## Member List
- `auth-store.ts`
  - Core function: Manage user authentication state and session tokens, store user data and access token with cookie persistence;
  - Technical details: Uses Zustand for state management, integrates with cookie utilities for token storage, provides auth actions (setUser, setAccessToken, reset);
  - Key parameters: auth.user (current user data), auth.accessToken (JWT/session token), auth.setUser() (update user), auth.reset() (clear all auth state)

**Statement:** Once the folder I belong to (including file structure, functional positioning, etc.) changes, please update me.

## Member List
- `main.tsx`
  - Core function: Application entry point, initialize providers (QueryClient, I18next, Theme, Font, Direction, Router), configure error handling for 401/403/500/304 status codes;
  - Technical details: Sets up TanStack Query with retry logic, TanStack Router with code-splitting, handles auth errors with cookie-based token storage;
  - Key parameters: QueryClient (queries: { retry, refetchOnWindowFocus, staleTime: 10000 }), error handlers for 401 (redirect to sign-in), 500 (navigate to error page)

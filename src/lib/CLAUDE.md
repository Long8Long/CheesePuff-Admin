**Statement:** Once the folder I belong to (including file structure, functional positioning, etc.) changes, please update me.

## Member List
- `utils.ts`
  - Core function: Common utility functions for className merging, date formatting, pagination;
  - Technical details: Uses clsx and tailwind-merge for cn() function, provides sleep(), getTodayString(), getPageNumbers() helpers;
  - Key parameters: cn() (class merger), getPageNumbers(currentPage, totalPages), sleep(ms), getTodayString(date)
- `cookies.ts`
  - Core function: Cookie operations without external dependencies, replacement for js-cookie library;
  - Technical details: SSR-safe operations (checks for document object), provides getCookie(), setCookie(), removeCookie();
  - Key parameters: getCookie(name), setCookie(name, value, maxAge), removeCookie(name)
- `handle-server-error.ts`
  - Core function: Standardized error message display using toast notifications;
  - Technical details: Handles Axios errors with response data, processes 204 No Content, logs errors to console;
  - Key parameters: handleServerError(error)
- `api.ts`
  - Core function: Axios HTTP client with interceptors for auth and camelCase/snake_case conversion;
  - Technical details: Auto-adds Authorization header from cookie, uses humps library for case conversion (snake_case → camelCase in response, camelCase → snake_case in request), handles 401 redirects;
  - Key parameters: baseURL (env var), timeout (30000ms), request interceptor (adds token, converts to snake_case), response interceptor (converts to camelCase)

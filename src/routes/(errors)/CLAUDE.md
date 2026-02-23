**Statement:** Once the folder I belong to (including file structure, functional positioning, etc.) changes, please update me.

## Member List
- `401.tsx`
  - Core function: 401 Unauthorized error page route, displayed for authentication errors;
  - Technical details: User not authenticated, prompts login with redirect;
  - Key parameters: redirect URL after login
- `403.tsx`
  - Core function: 403 Forbidden error page route, displayed for permission errors;
  - Technical details: User authenticated but lacks permission for resource;
  - Key parameters: missing permission, resource details
- `404.tsx`
  - Core function: 404 Not Found error page route, displayed for missing resources;
  - Technical details: Resource or route not found, provides search and home navigation;
  - Key parameters: missing path/URL
- `500.tsx`
  - Core function: 500 Internal Server Error page route, displayed for server errors;
  - Technical details: Unexpected server error, provides retry option;
  - Key parameters: error details
- `503.tsx`
  - Core function: 503 Service Unavailable error page route, displayed during maintenance;
  - Technical details: Service temporarily unavailable for maintenance;
  - Key parameters: maintenance message, estimated downtime

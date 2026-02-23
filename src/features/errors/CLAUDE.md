**Statement:** Once the folder I belong to (including file structure, functional positioning, etc.) changes, please update me.

## Member List
- `forbidden.tsx`
  - Core function: 403 Forbidden error page, displayed when user lacks permission for resource;
  - Technical details: Error page with illustration and back navigation;
  - Key parameters: error details, return link
- `general-error.tsx`
  - Core function: 500 Internal Server Error page, displayed for unexpected server errors;
  - Technical details: Generic error page with retry option;
  - Key parameters: error message, retry action
- `maintenance-error.tsx`
  - Core function: 503 Service Unavailable page, displayed during maintenance;
  - Technical details: Maintenance notice with estimated downtime;
  - Key parameters: maintenance message
- `not-found-error.tsx`
  - Core function: 404 Not Found error page, displayed when resource is not found;
  - Technical details: Friendly 404 page with search and home link;
  - Key parameters: missing resource path
- `unauthorized-error.tsx`
  - Core function: 401 Unauthorized error page, displayed when user is not authenticated;
  - Technical details: Prompts user to sign in, includes redirect to login;
  - Key parameters: redirect URL after login

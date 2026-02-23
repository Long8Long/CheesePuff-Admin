**Statement:** Once the folder I belong to (including file structure, functional positioning, etc.) changes, please update me.

## Member List
- `__root.tsx`
  - Core function: Root layout component with global providers and error handling, renders Outlet for child routes;
  - Technical details: Provides queryClient context to all routes, renders NavigationProgress, Toaster, and DevTools, implements error boundaries for 404/500;
  - Key parameters: queryClient (context), Outlet (child routes), errorComponent, notFoundComponent

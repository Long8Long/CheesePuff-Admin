**Statement:** Once the folder I belong to (including file structure, functional positioning, etc.) changes, please update me.

## Member List
- `index.tsx`
  - Core function: User management page, displays user list with data table and CRUD operations;
  - Technical details: Uses DataTable component with pagination, filtering, sorting, URL state sync;
  - Key parameters: users data, table state (page, pageSize, search, filters, sorting)
- `components/`
  - Core function: User-specific UI components for management interface;
  - Technical details: Includes user-table-columns, user-form, user-dialog, user-actions components;
  - Key parameters: user data, CRUD handlers, table state
- `data/`
  - Core function: Data layer for users feature;
  - Technical details: Contains schema.ts (Zod validation), data.ts (mock user records);
  - Key parameters: user schema, mock users array

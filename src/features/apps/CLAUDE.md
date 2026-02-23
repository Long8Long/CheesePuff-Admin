**Statement:** Once the folder I belong to (including file structure, functional positioning, etc.) changes, please update me.

## Member List
- `index.tsx`
  - Core function: Applications management page, displays and manages application list with data table;
  - Technical details: Uses DataTable component with pagination, filtering, and sorting, integrates with mock data;
  - Key parameters: applications data, table state (pagination, filters, sorting)
- `data/`
  - Core function: Data layer for applications feature, includes schema and mock data;
  - Technical details: Contains schema.ts (Zod validation), data.ts (mock application records);
  - Key parameters: application schema, mock applications array

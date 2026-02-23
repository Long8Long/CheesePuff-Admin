**Statement:** Once the folder I belong to (including file structure, functional positioning, etc.) changes, please update me.

## Member List
- `index.tsx`
  - Core function: Cat management page with full CRUD operations, displays cat list with data table;
  - Technical details: Uses DataTable component, URL state sync (pagination, filters, sorting), integrates with cat services;
  - Key parameters: cat data, table state (page, pageSize, search, filters, sorting)
- `components/`
  - Core function: Cat-specific UI components for management interface;
  - Technical details: Includes cat-table-columns, cat-form, cat-dialog, cat-actions, cat-filters;
  - Key parameters: cat data, CRUD handlers, table state
- `data/`
  - Core function: Data layer for cats feature, includes schema, types, and mock data;
  - Technical details: Contains schema.ts (Zod validation), data.ts (mock cat records), types for domain/API/UI;
  - Key parameters: cat schema (validation rules), mock cats array, TypeScript types
- `models/`
  - Core function: Domain model types for cat entities;
  - Technical details: Includes cat.types.ts (domain models), cat-api.types.ts (API contract), cat-ui.types.ts (UI state types);
  - Key parameters: Cat interface, CatApiResponse, CatUiState
- `services/`
  - Core function: Cat API service layer for backend communication;
  - Technical details: CRUD operations (getCats, getCat, createCat, updateCat, deleteCat), integrates with HTTP client;
  - Key parameters: cat service methods, API endpoints

**Statement:** Once the folder I belong to (including file structure, functional positioning, etc.) changes, please update me.

## Member List
- `use-table-url-state.ts`
  - Core function: Synchronizes data table state (pagination, filters, sorting) with URL query parameters for shareable URLs;
  - Technical details: Integrates with TanStack Router navigate and search params, supports string/array column filters with custom serialization;
  - Key parameters: pagination (page, pageSize), globalFilter, columnFilters, onPaginationChange(), onGlobalFilterChange(), onColumnFiltersChange(), ensurePageInRange()
- `use-dialog-state.tsx`
  - Core function: Manages dialog open/closed state with support for multiple dialog types via generic typing;
  - Technical details: Toggle behavior (opening same dialog closes it), returns tuple like useState;
  - Key parameters: open (T | null), setOpen(value)
- `use-mobile.tsx`
  - Core function: Detects if current viewport is mobile-sized for responsive layouts;
  - Technical details: Uses window.matchMedia with 768px breakpoint, SSR-safe (returns undefined during SSR), reactive to window resize;
  - Key parameters: isMobile (boolean)

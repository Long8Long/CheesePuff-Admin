**Statement:** Once the folder I belong to (including file structure, functional positioning, etc.) changes, please update me.

## Member List
- `apps/index.tsx`
  - Core function: Applications management page, display and manage applications;
  - Technical details: Feature module for app management;
  - Key parameters: applications data
- `chats/index.tsx`
  - Core function: Chat/messaging functionality page;
  - Technical details: Feature module for in-app messaging;
  - Key parameters: chat data, messages
- `dashboard/index.tsx`
  - Core function: Main dashboard page with analytics and overview data;
  - Technical details: Tabbed interface (Overview, Analytics, Reports, Notifications), KPI cards, Recharts integration;
  - Key parameters: analytics data, overview charts, recent sales
- `cats/index.tsx`
  - Core function: Cat management page with full CRUD operations and data table;
  - Technical details: Models include cat.types.ts (domain), cat-api.types.ts (API), cat-ui.types.ts (UI), data includes schema.ts (Zod), data.ts (mock);
  - Key parameters: cat data, table filters, pagination, sorting
- `settings/index.tsx`
  - Core function: Settings pages with sub-features for profile, account, appearance, display, notifications, store-management, cattery-config;
  - Technical details: Sub-features include profile (user settings), account (password/email), appearance (theme), display (language/timezone), notifications (preferences), store-management (store config), cattery-config (cat facility config);
  - Key parameters: settings data, form submissions
- `users/index.tsx`
  - Core function: User management page;
  - Technical details: Feature module for managing application users;
  - Key parameters: users data, user operations

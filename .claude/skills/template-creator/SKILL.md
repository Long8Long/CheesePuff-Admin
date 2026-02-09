# Feature Template System Guide

## Overview

This project uses a **template system** to keep reference implementations separate from production code. Templates are **not included** in the build, keeping your bundle size small.

---

## Why Use This System?

- **Smaller Bundle Size**: Templates don't get built
- **Consistency**: All features follow the same structure
- **Faster Development**: Copy a template instead of starting from scratch

---

## Directory Structure

```
CatMaster/
├── templates/              # Reference code (NOT built)
│   ├── features/           # Feature templates
│   └── routes/             # Route templates
│
├── src/                    # Production code (gets built)
│   ├── features/           # Active features
│   └── routes/             # Active routes
│
└── dist/                   # Build output
```

**Key Point**: Only `src/` gets built. `templates/` is ignored.

---

## Part 1: Converting a Feature to Template

### Step 1: Create Template Directories

```bash
mkdir -p templates/features
mkdir -p templates/routes/_authenticated
```

### Step 2: Move Feature to Templates

```bash
# Move the feature code
mv src/features/tasks templates/features/task-template

# Move the route code
mv src/routes/_authenticated/tasks templates/routes/_authenticated/task-template
```

### Step 3: Remove from Navigation

Edit the file `src/components/layout/data/sidebar-data.ts`:
- Remove the feature's menu item
- Remove unused icon imports

### Step 4: Verify Build

```bash
rm -rf dist
pnpm run build
```

Expected: Build succeeds without errors.

### Step 5: Check Bundle Size

```bash
du -sh dist
```

The size should be smaller than before.

---

## Part 2: Creating a New Feature from Template

### Step 1: Copy Template

```bash
# Copy feature template
cp -r templates/features/task-template src/features/products

# Copy route template
cp -r templates/routes/_authenticated/task-template src/routes/_authenticated/products
```

### Step 2: Rename References

In all copied files, find and replace:
- `task-template` → `products`
- `Task` → `Product`
- `Tasks` → `Products`
- `tasks` → `products`

### Step 3: Update Data Schema

Edit `src/features/products/data/schema.ts` to define your data structure.

### Step 4: Add to Navigation

Edit `src/components/layout/data/sidebar-data.ts`:
- Add your new feature to the menu
- Import the appropriate icon

### Step 5: Test

```bash
pnpm run dev
```

Open your browser and navigate to your new feature (e.g., `http://localhost:5173/products`).

---

## Part 3: Best Practices

### DO ✅

- Keep templates updated when you improve features
- Use descriptive names (e.g., `task-template`, not `template`)
- Document what each template includes
- Test before committing

### DON'T ❌

- **Never** import from templates in production code
- Don't modify templates directly (copy first, then modify)
- Don't leave unused features in `src/` (move to templates)

---

## Part 4: Troubleshooting

### Build Fails After Moving Feature

**Problem**: Error "Cannot find module"

**Solution**:
- Make sure both feature AND route were moved
- Search for remaining imports: `grep -r "features/tasks" src/`
- Update or remove any remaining references

### Feature Still Shows in Menu

**Problem**: Menu item visible but page shows 404

**Solution**:
- Remove menu item from `src/components/layout/data/sidebar-data.ts`
- Remove unused icon imports
- Restart dev server

### Template Still in Build

**Problem**: Bundle size didn't decrease

**Solution**:
- Verify template is NOT in `src/` directory
- Check for imports from template paths
- Clean rebuild: `rm -rf dist && pnpm run build`

---

## Quick Reference

| Task | Command |
|------|---------|
| Create new feature | `cp -r templates/features/task-template src/features/your-feature` |
| Verify build | `pnpm run build` |
| Check bundle size | `du -sh dist` |
| Find references | `grep -r "feature-name" src/` |
| Start dev server | `pnpm run dev` |

---

## File Locations

| What | Where |
|------|-------|
| Templates | `templates/` |
| Features | `src/features/` |
| Routes | `src/routes/` |
| Navigation | `src/components/layout/data/sidebar-data.ts` |
| Build output | `dist/` |

---

## Summary

**The Workflow**:
1. Feature exists in `src/`
2. Move to `templates/` when not needed in production
3. Copy template to create new features
4. Update the copied files
5. Build includes only `src/` code

**Result**: Smaller bundles, consistent structure, faster development.

---

**Need More Help?**
- Check `templates/README.md` for template-specific info
- Review existing templates as examples
- See troubleshooting section above

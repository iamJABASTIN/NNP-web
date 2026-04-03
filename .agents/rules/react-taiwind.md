---
trigger: always_on
---

# Antigravity — React + Tailwind Production Rules

> These rules are enforced for every agent interaction involving React and Tailwind CSS code in this project. No exceptions.

---

## 1. Component Architecture

### 1.1 Single Responsibility — One Component, One Job
Every component must do exactly one thing. If you find yourself writing "and" when describing what a component does, it must be split.

```
❌ UserProfileWithPostsAndSettings
✅ UserAvatar  /  UserBio  /  UserPostList  /  SettingsPanel
```

### 1.2 File Size Hard Limits
| File type | Max lines |
|-----------|-----------|
| Page / Route component | 80 lines |
| Feature component | 120 lines |
| UI / Presentational component | 60 lines |
| Custom hook | 80 lines |
| Utility function file | 100 lines |

When a file exceeds its limit, **stop and split before continuing**.

### 1.3 Mandatory Folder Structure
```
src/
├── app/                        # Next.js App Router pages / layouts
│   └── (route)/
│       ├── page.tsx
│       └── layout.tsx
├── components/
│   ├── ui/                     # Primitive, stateless UI atoms
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.types.ts
│   │   │   └── index.ts
│   ├── features/               # Domain-specific composed components
│   │   └── Auth/
│   │       ├── LoginForm.tsx
│   │       ├── LoginForm.types.ts
│   │       └── index.ts
│   └── layouts/                # Page-level structural wrappers
├── hooks/                      # All custom hooks — no hooks inside components
├── lib/                        # Third-party initialisation (supabase, axios…)
├── services/                   # API / data-fetching functions
├── stores/                     # Global state (Zustand / Jotai)
├── types/                      # Shared TypeScript types & interfaces
└── utils/                      # Pure helper functions
```

### 1.4 Every Component Must Have a Barrel Export
```ts
// components/ui/Button/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button.types';
```

---

## 2. Component Decomposition Rules

### 2.1 Decompose Immediately When You See
- A JSX tree deeper than **4 levels**
- A list render that contains more than a single element per item
- A conditional block longer than **8 lines**
- Two or more `useEffect` calls in the same component
- Inline event handlers longer than one expression

### 2.2 Decomposition Pattern
```tsx
// ❌ Monolithic
export function Dashboard() {
  return (
    <div>
      <header>…40 lines of nav…</header>
      <main>…60 lines of content…</main>
      <aside>…30 lines of sidebar…</aside>
      <footer>…20 lines…</footer>
    </div>
  );
}

// ✅ Decomposed
export function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardNav />
      <DashboardContent />
      <DashboardSidebar />
    </DashboardLayout>
  );
}
```

### 2.3 Lists Always Use a Dedicated Item Component
```tsx
// ❌
{users.map(user => (
  <div key={user.id}>
    <img src={user.avatar} />
    <span>{user.name}</span>
    <span>{user.email}</span>
  </div>
))}

// ✅
{users.map(user => <UserListItem key={user.id} user={user} />)}
```

---

## 3. TypeScript Requirements

### 3.1 Props Interface — Always Explicit
```ts
// ✅ — Every component has a named Props interface in its own .types.ts file
// components/ui/Button/Button.types.ts
export interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
  className?: string;
}
```

### 3.2 Forbidden Patterns
```ts
❌  props: any
❌  props: object
❌  as unknown as X
❌  // @ts-ignore
❌  // @ts-expect-error   (without an explanatory comment)
```

### 3.3 Discriminated Unions for Component Variants
```ts
type CardProps =
  | { variant: 'info';    icon: React.ReactNode }
  | { variant: 'warning'; dismissible: boolean }
  | { variant: 'error';   onRetry: () => void };
```

---

## 4. Tailwind CSS Rules

### 4.1 Class Organisation Order (always follow)
```
Layout → Flexbox/Grid → Spacing → Sizing → Typography → Color → Border → Effect → State
```
```tsx
// ✅
<div className="flex items-center gap-4 px-6 py-3 w-full text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150">
```

### 4.2 Reusable Class Bundles — Use `cn()` + `cva`
Never repeat the same class string in two places. Extract it.

```ts
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

```ts
// components/ui/Button/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:   'bg-indigo-600 text-white hover:bg-indigo-700',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        ghost:     'hover:bg-gray-100 hover:text-gray-900',
        danger:    'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        sm: 'h-8  px-3 text-xs',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);
```

### 4.3 Forbidden Tailwind Patterns
```tsx
❌  style={{ color: '#3b82f6' }}          // use Tailwind instead
❌  className={`text-${dynamicColor}-500`} // unsafe dynamic classes
❌  className="..."  // strings over 10 classes without cva or cn()
```

### 4.4 Responsive Design — Mobile First, Always
```tsx
// ✅
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
```

---

## 5. State Management

### 5.1 State Placement Hierarchy
```
1. Local useState          → UI-only state (open/closed, hover, form fields)
2. Custom hook             → Reused local logic
3. React Context           → Feature-scoped shared state (auth, theme)
4. Zustand / Jotai store   → Cross-feature global state
5. Server state (TanStack) → Remote / async data — NEVER duplicate in local state
```

### 5.2 No Business Logic in JSX
```tsx
// ❌
<button onClick={() => {
  if (!user) return;
  setLoading(true);
  await api.deletePost(post.id);
  setLoading(false);
  refetch();
}}>

// ✅
<button onClick={handleDeletePost}>
```

### 5.3 Custom Hook Rules
- Hook name always starts with `use`
- One hook per concept — do not bundle unrelated logic
- Hooks live in `src/hooks/` — never defined inside a component file

```ts
// hooks/usePostDeletion.ts
export function usePostDeletion(postId: string) {
  const [isDeleting, setIsDeleting] = useState(false);
  // …logic…
  return { isDeleting, deletePost };
}
```

---

## 6. Performance

### 6.1 Memoisation Rules
| Scenario | Tool |
|----------|------|
| Expensive computation | `useMemo` |
| Callback passed to child | `useCallback` |
| Component that receives stable props | `React.memo` |

Only memoize when there is a **measurable** reason. Do not memoize by default.

### 6.2 Code Splitting
```tsx
// Every page-level and heavy feature component must be lazy-loaded
const HeavyChart = lazy(() => import('@/components/features/Analytics/HeavyChart'));
```

### 6.3 Image Optimisation
```tsx
// Always use Next.js Image — never raw <img> for content images
import Image from 'next/image';
<Image src={src} alt={alt} width={800} height={600} priority={isAboveFold} />
```

---

## 7. Accessibility (a11y)

- Every interactive element must have an accessible label (`aria-label`, `aria-labelledby`, or visible text).
- Focus order must match visual order.
- Color contrast ratio ≥ 4.5:1 for normal text, ≥ 3:1 for large text.
- Use semantic HTML — `<button>` for actions, `<a>` for navigation, `<nav>`, `<main>`, `<header>`, `<footer>`, `<section>`.
- Loading states must expose `aria-busy="true"`.
- Error messages must use `role="alert"`.

---

## 8. Error Boundaries & Loading States

### 8.1 Every Async Boundary Needs Three States
```tsx
// ✅ Required pattern for every async component
if (isLoading) return <SkeletonCard />;
if (isError)   return <ErrorMessage message={error.message} onRetry={refetch} />;
if (!data)     return <EmptyState />;
return <DataComponent data={data} />;
```

### 8.2 Error Boundaries at Route Level
```tsx
// app/(route)/layout.tsx
export default function Layout({ children }) {
  return <ErrorBoundary fallback={<RouteError />}>{children}</ErrorBoundary>;
}
```

---

## 9. Testing

- Every UI component must have at minimum a **smoke test** (renders without crash).
- Every custom hook must have a unit test covering the happy path and one error case.
- Integration tests cover user flows, not implementation details.
- Use **React Testing Library** — never access internal component state in tests.

---

## 10. Code Review Checklist

Before submitting any component:

- [ ] File is under its line limit
- [ ] Props interface is in a `.types.ts` file
- [ ] No `any` types
- [ ] Tailwind classes use `cn()` / `cva` where repeated or conditional
- [ ] No inline event handlers with logic
- [ ] Loading, error, and empty states are handled
- [ ] Accessible labels are present on all interactive elements
- [ ] Component is exported via a barrel `index.ts`
- [ ] All new logic extracted into a named custom hook

---
trigger: always_on
---

### Rule of NextJS + Tailwind CSS Coding

# 1.Don't always create new components

try to use global compoenets that project have it, if that haven't in global. write new one and insert in global component.

# 2.Don't write hardcode css

use only global.css keep color theme in same tone

# 3.Don't write very lone code in same file

don't write everything in one file, split to new component / hook / lib / context / etc for a perpose file

# 4. Use React 19 / 2025 Best Practices (Avoid useEffect)

Do not use `useEffect` to synchronize state based on props or context changes. This is a React 18 anti-pattern that causes double-renders and cascading updates. 

Instead, use the "updating state during render" pattern. Store the previous value in state and update the dependent state directly during the render phase:

```typescript
// GOOD: React 19 Pattern
const [prevValue, setPrevValue] = useState(value);
if (value !== prevValue) {
  setPrevValue(value);
  setDependentState(newValue);
}
```

Use `use()` for promises, Server Actions for mutations, and `useSyncExternalStore` for external subscriptions. `useEffect` should be an absolute last resort, mostly for non-React DOM manipulation or analytics.

# Implementation Plan: Replace Alert with Toast for Duplicate Names & Add E2E Test

## Objective
Replace the native browser `alert()` with the custom `Toast` component for duplicate product name errors and add an end-to-to test using Playwright to verify the UI behavior.

## Key Files & Context
- `src/app/manage/hooks/useProductManagement.ts`: Currently uses `alert(err)` to display errors. Will be updated to use the `useToast` hook.
- `src/components/manage/ProductModal.tsx`: Need to ensure it can still correctly handle submission failure and that the user isn't stuck with an unhandled loading state or bad UX, though `useProductManagement.ts` currently handles the catch block and sets `isSubmitting(false)`.
- `e2e/playwright/vibe-pos.spec.ts`: The Playwright test file where a new step will be added to verify the duplicate product name toast.

## Implementation Steps
1. **Update `useProductManagement.ts`:**
   - Import `useToast` from `@/context/ToastContext`.
   - Call `const { showToast } = useToast();` inside the hook.
   - Replace all instances of `alert(err)` or `alert(...)` with `showToast(String(err), "error")`.
   
2. **Update `vibe-pos.spec.ts` (Playwright E2E):**
   - Add a new step after creating the initial product ('Espresso').
   - Attempt to create another product with the same title ('Espresso').
   - Fill in the required details and click "Save Product".
   - Verify that the toast notification appears with the text "A product with this name already exists." or similar error text from the backend.
   - Locate the close button (the `FaTimes` icon/button) on the toast and click it to verify the UI can dismiss the alert.
   - Wait for the toast to be hidden to confirm dismissal works.
   - Close the product modal using its cancel/close button so the rest of the tests can proceed smoothly.

## Verification & Testing
- Run `npm run lint` and `npm run build` to ensure type safety and build success.
- Run `npm run test:e2e` to verify the Playwright tests pass, specifically the new duplicate name test.
- Manually run the app (`npm run tauri dev`) to verify the toast appears correctly in the browser when simulating the error.

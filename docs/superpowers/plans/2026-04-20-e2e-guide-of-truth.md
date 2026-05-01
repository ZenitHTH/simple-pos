# Vibe POS: E2E Guide of Truth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** สร้างระบบทดสอบ E2E ที่เสถียร 100% บน Fedora 43 GNOME Wayland โดยใช้กลยุทธ์ "Hybrid UI + API Backdoor" ตามคำแนะนำของชุมชน Tauri v2 เพื่อยืนยันความถูกต้องของข้อมูลในระดับ Database Truth

**Architecture:** 
1.  **Infrastructure**: ใช้ System Chrome เพื่อเลี่ยงปัญหา Library mismatch และใช้ Env vars (`WEBKIT_DISABLE_DMABUF_RENDERER`) เพื่อความเสถียรบน Wayland
2.  **Instrumentation**: ฝังช่องทางพิเศษ (Backdoors) ในแอปเพื่อสั่งงานผ่าน API และตรวจสอบสถานะ Database ได้โดยตรง
3.  **Synchronization**: ใช้ระบบ Action Markers ผ่าน Logger เพื่อให้ Test ทราบสถานะจริงของแอปโดยไม่ต้องใช้ `waitForTimeout`

**Tech Stack:** Playwright (System Chrome), Tauri v2, Next.js 16, TypeScript

---

### Task 1: Environment & Infrastructure Hardening

**Files:**
- Modify: `scripts/run-e2e.mjs`
- Modify: `playwright.config.ts`

- [ ] **Step 1: Configure Linux Stability Environment**
เพิ่มตัวแปรสภาพแวดล้อมที่ชุมชนแนะนำสำหรับ WebKitGTK และ Wayland ใน `scripts/run-e2e.mjs`

```javascript
// ใน scripts/run-e2e.mjs
const env = {
  ...process.env,
  WEBKIT_DISABLE_DMABUF_RENDERER: '1',
  GDK_BACKEND: 'x11', // เสถียรกว่าสำหรับ automation บน Wayland
  VIBE_POS_IN_MEMORY: '1'
};
```

- [ ] **Step 2: Increase Global Test Timeout**
ปรับ Timeout ใน `playwright.config.ts` เป็น 3 นาทีเพื่อรองรับการทำงานบนระบบที่ Resource จำกัด

```typescript
export default defineConfig({
  timeout: 180000,
  // ... rest
});
```

- [ ] **Step 3: Run verification**
รัน `node scripts/run-e2e.mjs --target-env=linux --skip-build` เพื่อตรวจสอบว่า Browser เปิดขึ้นมาได้โดยไม่ crash

- [ ] **Step 4: Commit**
`git add scripts/run-e2e.mjs playwright.config.ts && git commit -m "chore(e2e): harden environment for Fedora/Wayland stability"`

---

### Task 2: API & State Backdoor Exposure

**Files:**
- Modify: `src/lib/api/settings.ts`
- Modify: `src/lib/api/categories.ts`
- Modify: `src/lib/api/products.ts`
- Modify: `src/lib/api/receipts.ts`
- Modify: `src/context/DataContext.tsx`
- Modify: `src/components/layout/AppShell.tsx`

- [ ] **Step 1: Expose Backend APIs**
เปิดให้ Playwright เรียกใช้ API ได้ผ่าน `window` object ในแต่ละไฟล์ API ดังนี้:
`window.categoryApi`, `window.productApi`, `window.receiptApi`, `window.settingsApi`

- [ ] **Step 2: Expose Cache & Router**
เพื่อให้ Test สั่ง Refresh ข้อมูลบนหน้าจอและเปลี่ยนหน้าได้ทันที:
`window.updateCache` ใน `DataContext.tsx` และ `window.router` ใน `AppShell.tsx`

- [ ] **Step 3: Commit**
`git add src/lib/api/*.ts src/context/DataContext.tsx src/components/layout/AppShell.tsx && git commit -m "feat(e2e): expose API and Router backdoors for test automation"`

---

### Task 3: Action Marker System (The Synchronization Layer)

**Files:**
- Modify: `src/lib/utils/logger.ts`
- Modify: `src/components/layout/WelcomeScreen.tsx`

- [ ] **Step 1: Implement Action Logging**
เพิ่มวิธีส่งสัญญาณ "ความจริง" จากแอปไปยัง Test runner ใน `src/lib/utils/logger.ts` ผ่าน `window.__TEST_MARKERS__`

- [ ] **Step 2: Instrument Welcome Screen**
ส่งสัญญาณ `welcome_start_clicked` เมื่อกดปุ่มเริ่มทำงาน

- [ ] **Step 3: Commit**
`git add src/lib/utils/logger.ts src/components/layout/WelcomeScreen.tsx && git commit -m "feat(e2e): implement action marker system for test synchronization"`

---

### Task 4: Unified "Guide of Truth" Spec Implementation

**Files:**
- Create: `e2e/playwright/helpers.ts` (Rewrite)
- Create: `e2e/playwright/vibe-pos.spec.ts` (Rewrite)

- [ ] **Step 1: Implement God-Tier Helpers**
สร้าง Helper ที่มีระบบ Auto-Fallback ไปยัง System Chrome และ Database Check (`verifyDatabaseState`, `waitForAction`)

- [ ] **Step 2: Write The Unified Golden Path**
เขียน Test ตัวเดียวที่ครอบคลุม: Welcome -> Create Category -> Create Product -> Sale -> Verify Receipt

- [ ] **Step 3: Run and Verify 100% Pass**
รัน `node scripts/run-e2e.mjs --target-env=linux --skip-build e2e/playwright/vibe-pos.spec.ts --reporter=list`

- [ ] **Step 4: Commit**
`git add e2e/playwright/ && git commit -m "test(e2e): implement unified guide of truth spec"`

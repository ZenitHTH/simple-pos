# Undo/Redo History Design

## 1. Overview
This spec outlines the implementation of a session-based Undo/Redo system for the Vibe POS Design Mode. It allows users to experiment with UI scaling, typography, and themes with the safety of being able to revert changes instantly.

## 2. Architecture
The system will follow a standard "Command" or "Memento" pattern using two stacks managed within the `SettingsContext`.

### 2.1 State Structure
- `past: AppSettings[]`: A stack of previous states (limited to 20).
- `future: AppSettings[]`: A stack of states that were undone (cleared on new manual actions).

### 2.2 Core Actions
- `undo()`: Reverts to the previous state.
- `redo()`: Re-applies an undone state.
- `commitHistory()`: Manually pushes the current state to `past` (used for discrete actions like "Apply Preset").
- `updateSettings(updates, shouldCommit)`: An enhanced version of the current update function that optionally commits to history.

## 3. UI/UX
- **BottomControlPanel**: Two new buttons (FaUndo, FaRedo) will be added to the left of the "Save Changes" button.
- **Keyboard Shortcuts**:
    - `Ctrl + Z` / `Cmd + Z`: Undo
    - `Ctrl + Y` / `Cmd + Y` or `Ctrl + Shift + Z`: Redo
- **Visual Feedback**: Buttons will use standard `disabled` states when no history is available.

## 4. Implementation Details
- **Action-Based Grouping**: Continuous changes (like dragging a slider) will NOT trigger a history commit on every change. Instead, the commit will happen on `onMouseUp` (drag end) or when a discrete UI button is clicked.
- **Max History**: The `past` array will be capped at 20 items using `.slice(-20)`.

## 5. Testing
- Verify state restoration for nested objects (e.g., typography weights).
- Verify that `future` stack is cleared when a new action is performed after an undo.
- Verify that keyboard shortcuts function globally within the app shell.

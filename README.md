# Vibe POS (Simple POS) v0.2.1

A professional, modern, and lightweight Point of Sale (POS) system built with **Tauri v2** and **Next.js 16**, designed for high performance, security, and simplicity.

## Features

- **Point of Sale Interface**: Fast and intuitive interface for processing sales with optimized touch support.
- **Advanced Inventory Management**:
  - **Product Management**: Detailed product tracking with categories and images.
  - **Material & Recipe Management**: Track raw materials and define recipes for complex items (e.g., drinks, food).
  - **Real-time Stock Tracking**: Monitor inventory levels with low-stock alerts.
- **Customer Management**: Track customer information and purchase history.
- **Checkout & Payment**:
  - **Virtual Numpad**: Optimized touchscreen numeric keypad for quick cash entry.
  - **Touch-Optimized Cart**: Large touch targets for interactive cart elements.
  - **Smart Change Calculation**: Automated change display with validity checks.
  - **Receipt Generation**: Backend integration for secure transaction recording.
- **Modern Design Tuner (New)**:
  - **Apple-Inspired Dark Mode**: A sleek, flat interface with glassmorphism and modern aesthetics.
  - **Layout Presets**: Quickly toggle between **Compact POS** (high density) and **Cozy Desktop** (spacious) modes.
  - **Interactive Preview**: Real-time visualization of button styles, typography, and UI elements.
  - **Fluid Animations**: Powered by `framer-motion` for a premium, responsive feel.
  - **Global Display Scaling**: Adjust the entire interface size from 50% to 200% with real-time feedback.
- **Data Export & Reporting**:
  - Export transaction data to CSV, XLSX, and ODS.
  - **Thai Accounting Integration**: Built-in support for Thai Sales Tax Reports (รายงานภาษีขาย).
- **Order History**:
  - Comprehensive view of past transactions with filters and search.
- **Mock API Mode**: Develop and test the UI directly in the browser without needing the Tauri backend.
- **Security & Privacy**:
  - **Encrypted Database**: Local data is protected via **SQLCipher** (AES-256 encryption).
  - **Local-First**: Your data stays on your machine.

## Tech Stack

- **Frontend**: [Next.js 16](https://nextjs.org/) (React 19), [Tailwind CSS 4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Backend**: [Tauri v2](https://v2.tauri.app/) (Rust)
- **Database**: SQLite with **SQLCipher** (via Diesel ORM in Rust)
  - **Automatic Path Resolution**: Uses `directories` crate to store data securely in the system's local data directory (e.g., `~/.local/share/simple-pos` on Linux).
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/) (Font Awesome & more)
- **State Management**: React Hooks & Context (optimized with specialized providers)

## Project Structure

The project has been refactored into a highly organized, production-grade structure:

- **`src/app/`**: Next.js App Router pages and layouts.
- **`src/components/`**: Modularized UI components, including UI primitives and feature-specific components.
- **`src/context/`**: Global state management (Settings, Database, Mockup, Toast).
- **`src/lib/`**: Reorganized core library:
  - **`api/`**: Module-based service layer for backend communication.
  - **`types/`**: Specialized TypeScript definitions for each domain.
  - **`utils/`**: Shared helper functions.
  - **`constants/`**: Permanent application constants and example data.
- **`src-tauri/`**: Rust backend source code and specialized crates.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v24 or newer recommended)
- **Rust & Cargo** (latest stable)
- **System Dependencies**:
  - **Linux**: Build essentials, webkit2gtk (see [Tauri Linux Setup](https://v2.tauri.app/start/prerequisites/#linux))
  - **macOS**:
    - **Xcode Command Line Tools**: `xcode-select --install`
    - **OpenSSL**: `brew install openssl`.
  - **Windows**:
    - Microsoft Visual Studio C++ Build Tools
    - **OpenSSL**: Required for database encryption (`sqlcipher`).

## Setup & Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run in Development Mode**
   ```bash
   npm run tauri dev
   ```

   > **Note for Linux Users**: The `tauri` script in `package.json` automatically sets `WEBKIT_DISABLE_DMABUF_RENDERER=1` to prevent rendering issues.

## Building for Production

To build a standalone executable for your operating system:

```bash
npm run tauri build
```

## Known Issues & Tasks

See the [TODO.md](./TODO.md) file for current bugs, pending tasks, and architectural decisions under discussion.

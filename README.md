# 🛒 Vibe POS (Simple POS) v0.2.1

A professional, modern, and lightweight Point of Sale (POS) system built with **Tauri v2** and **Next.js 16**, designed for high performance, security, and simplicity.

## Features

### Point of Sale Interface
- **Fast and intuitive interface** for processing sales with optimized touch support
- **Virtual Numpad**: Optimized touchscreen numeric keypad for quick cash entry
- **Touch-Optimized Cart**: Large touch targets for interactive cart elements
- **Smart Change Calculation**: Automated change display with validity checks
- **Receipt Generation**: Backend integration for secure transaction recording

### Inventory Management
- **Product Management**: Detailed product tracking with categories and images
- **Material & Recipe Management**: Track raw materials and define recipes for complex items (e.g., drinks, food)
- **Real-time Stock Tracking**: Monitor inventory levels with low-stock alerts
- **Thai Accounting Integration**: Built-in support for Thai Sales Tax Reports (รายงานภาษีขาย)

### Customer Management
- **Customer Information**: Track customer profiles and preferences
- **Purchase History**: Comprehensive view of past transactions with filters and search

### Modern Design Tuner (New)
- **Apple-Inspired Dark Mode**: A sleek, flat interface with glassmorphism and modern aesthetics
- **Layout Presets**: Toggle between **Compact POS** (high density) and **Cozy Desktop** (spacious) modes
- **Interactive Preview**: Real-time visualization of button styles, typography, and UI elements
- **Fluid Animations**: Powered by `framer-motion` for a premium, responsive feel
- **Global Display Scaling**: Adjust the entire interface size from 50% to 200% with real-time feedback

### Data Export & Reporting
- **Export Formats**: CSV, XLSX, and ODS
- **Thai Accounting Reports**: Sales tax reports with automatic calculations

## Tech Stack

- **Frontend**: [Next.js 16](https://nextjs.org/) (React 19), [Tailwind CSS 4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Backend**: [Tauri v2](https://v2.tauri.app/) (Rust)
- **Database**: SQLite with **SQLCipher** (via Diesel ORM in Rust)
  - Automatic Path Resolution: Uses `directories` crate to store data securely in the system's local data directory (e.g., `~/.local/share/simple-pos` on Linux)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/) (Font Awesome & more)
- **State Management**: React Hooks & Context (optimized with specialized providers)

## Project Structure

```
simple-pos/
├── src/
│   ├── app/
│   │   └── (Next.js pages)
│   ├── components/
│   │   └── (Modularized UI components)
│   ├── context/
│   │   └── (Global state management)
│   ├── lib/
│   │   ├── api/        # Module-based service layer
│   │   ├── types/      # TypeScript definitions
│   │   └── utils/      # Shared helper functions
│   └── constants/      # Permanent application constants
├── src-tauri/        # Rust backend source
├──TODO.md           # TODO list
└── package.json
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v24 or newer recommended)
- **Rust & Cargo** (latest stable)
- **System Dependencies**:
  - **Linux**: Build essentials, webkit2gtk
  - **macOS**: Xcode Command Line Tools, OpenSSL
  - **Windows**: Microsoft Visual Studio C++ Build Tools, OpenSSL

## Setup & Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Run in Development Mode

```bash
npm run tauri dev
```

> **Note for Linux Users**: The `tauri` script automatically sets `WEBKIT_DISABLE_DMABUF_RENDERER=1` to prevent rendering issues.

### 3. Build for Production

To build a standalone executable:

```bash
npm run tauri build
```

## Development Workflow

1. Start the development server
2. Build the executable for each OS
3. Test in production mode

## Building for Production

To build a standalone executable for your operating system:

```bash
npm run tauri build
```

## License

MIT

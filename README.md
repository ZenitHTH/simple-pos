# Simple POS

A modern, lightweight Point of Sale (POS) system built with **Tauri v2** and **Next.js 16**, designed for performance and simplicity.

## Features

- **Point of Sale Interface**: Fast and intuitive interface for processing sales.
- **Product Management**: Add, update, and remove products with details like price, category, and images.
- **Checkout Payment**: 
  - Cash payment support with automated change calculation.
  - Receipt generation and backend integration.
- **Order History**: 
  - View past transactions with date filtering.
  - Search receipts by unique ID.
  - Detailed receipt view with items and pricing.
- **Category Management**: Organize products into custom categories for easier navigation.
- **Settings**: Configure application preferences.
- **Cross-Platform**: Runs natively on Linux, macOS, and Windows.

## Tech Stack

- **Frontend**: [Next.js 16](https://nextjs.org/) (React 19), [Tailwind CSS 4](https://tailwindcss.com/)
- **Backend**: [Tauri v2](https://v2.tauri.app/) (Rust)
- **Database**: SQLite (via Diesel ORM in Rust)
- **State Management**: React Hooks & Context

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or newer recommended)
- **Rust & Cargo** (latest stable)
- **System Dependencies**:
  - **Linux**: Build essentials, webkit2gtk (see [Tauri Linux Setup](https://v2.tauri.app/start/prerequisites/#linux))
  - **macOS**: Xcode Command Line Tools
  - **Windows**: Microsoft Visual Studio C++ Build Tools

## Setup & Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd simple-pos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run in Development Mode**
   This command starts both the Next.js frontend and the Tauri application window.
   ```bash
   npm run tauri dev
   ```
   > **Note for Linux Users**: If you encounter rendering issues or crashes related to DMABUF, you may need to run:
   > ```bash
   > WEBKIT_DISABLE_DMABUF_RENDERER=1 npm run tauri dev
   > ```
   > or use the convenience script defined in `package.json`:
   > ```bash
   > npm run tauri
   > ```

## Building for Production

To build a standalone executable for your operating system:

```bash
npm run tauri build
```

The output binary will be located in `src-tauri/target/release/bundle/`.

## Project Structure

- **`src/`**: Next.js frontend source code.
  - `app/`:
    - `components/`: Reusable React components (`POSClient`, `Cart`, `PaymentModal`, etc.).
    - `history/`: Order history page and related components (`HistoryHeader`, `ReceiptList`, etc.).
    - `lib/`: Utility functions and API wrappers (`api.ts`).
- **`src-tauri/`**: Rust backend source code.
  - `src/`: Rust source files (`main.rs`, `commands/`, `database/`).
  - `tauri.conf.json`: Tauri configuration file.

## License

[MIT](LICENSE)

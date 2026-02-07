import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import { SettingsProvider } from "./context/SettingsContext";
import { MockupProvider } from "./context/MockupContext";
import BottomControlPanel from './components/design-mode/BottomControlPanel';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Simple POS",
  description: "Next.js POS Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex bg-background`}
      >
        <SettingsProvider>
          <MockupProvider>
            <Sidebar />
            <main className="flex-1 h-screen overflow-hidden pt-16 lg:pt-0 flex flex-col">
              {children}
            </main>
            <BottomControlPanel />
          </MockupProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import {
  Noto_Sans,
  Noto_Sans_Thai,
  Prompt,
  Sarabun,
  Inter,
  Kanit,
} from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import { SettingsProvider } from "@/context/settings/SettingsContext";
import { DatabaseProvider } from "@/context/DatabaseContext";
import DatabaseGuard from "@/components/common/DatabaseGuard";
import { MockupProvider } from "@/context/MockupContext";
import { ThemeProvider } from "@/components/theme-provider";
import SmoothScroll from "@/components/common/SmoothScroll";
import { ToastProvider } from "@/context/ToastContext";
import { AlertProvider } from "@/context/AlertContext";
import AppShell from "@/components/layout/AppShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${prompt.variable} ${sarabun.variable} ${kanit.variable} ${notoSansThai.variable} ${notoSans.variable} bg-background text-foreground flex antialiased`}
      >
        <SmoothScroll>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SettingsProvider>
              <AlertProvider>
                <ToastProvider>
                  <DatabaseProvider>
                    <MockupProvider>
                      <DatabaseGuard>
                        <AppShell>{children}</AppShell>
                      </DatabaseGuard>
                    </MockupProvider>
                  </DatabaseProvider>
                </ToastProvider>
              </AlertProvider>
            </SettingsProvider>
          </ThemeProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}

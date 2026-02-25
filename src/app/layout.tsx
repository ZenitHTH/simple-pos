import type { Metadata } from "next";
import {
  Noto_Sans,
  Noto_Sans_Mono,
  Noto_Sans_Thai,
  Noto_Serif_Thai,
  Noto_Serif,
  Prompt,
  Sarabun,
  Roboto,
  Montserrat,
  Inter,
  Kanit,
  Chakra_Petch,
  Mali,
  Itim,
  Bai_Jamjuree,
  Srisakdi,
} from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import { SettingsProvider } from "@/context/SettingsContext";
import { DatabaseProvider } from "@/context/DatabaseContext";
import DatabaseGuard from "@/components/common/DatabaseGuard";
import { MockupProvider } from "@/context/MockupContext";
import BottomControlPanel from "@/components/design-mode/BottomControlPanel";
import { ThemeProvider } from "@/components/theme-provider";
import SmoothScroll from "@/components/common/SmoothScroll";
import { ToastProvider } from "@/context/ToastContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra-petch",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const baiJamjuree = Bai_Jamjuree({
  variable: "--font-bai-jamjuree",
  subsets: ["thai", "latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

const mali = Mali({
  variable: "--font-mali",
  subsets: ["thai", "latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

const itim = Itim({
  variable: "--font-itim",
  subsets: ["thai", "latin"],
  weight: ["400"],
});

const srisakdi = Srisakdi({
  variable: "--font-srisakdi",
  subsets: ["thai", "latin"],
  weight: ["400", "700"],
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
});

const notoSerifThai = Noto_Serif_Thai({
  variable: "--font-noto-serif-thai",
  subsets: ["thai", "latin"],
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const notoMono = Noto_Sans_Mono({
  variable: "--font-noto-mono",
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
        className={`${inter.variable} ${prompt.variable} ${sarabun.variable} ${kanit.variable} ${chakraPetch.variable} ${baiJamjuree.variable} ${mali.variable} ${itim.variable} ${srisakdi.variable} ${notoSansThai.variable} ${notoSerifThai.variable} ${notoSans.variable} ${notoSerif.variable} ${roboto.variable} ${montserrat.variable} ${notoMono.variable} bg-background text-foreground flex antialiased`}
      >
        <SmoothScroll>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SettingsProvider>
              <ToastProvider>
                <DatabaseProvider>
                  <MockupProvider>
                    <DatabaseGuard>
                      <Sidebar />
                      <main className="flex h-screen flex-1 flex-col overflow-hidden pt-16 lg:pt-0">
                        {children}
                      </main>
                      <BottomControlPanel />
                    </DatabaseGuard>
                  </MockupProvider>
                </DatabaseProvider>
              </ToastProvider>
            </SettingsProvider>
          </ThemeProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}

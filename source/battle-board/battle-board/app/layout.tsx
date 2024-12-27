import type { Metadata } from "next";
import { Odibee_Sans, Nunito_Sans, Outfit } from "next/font/google";
import localFont from "next/font/local";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import Header from "../components/Header";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

const odibeeSans = Odibee_Sans({
  subsets: ["latin"],
  weight: "400", // Odibee Sans only has 400 weight available
  variable: "--font-odibee-sans", // Set a CSS variable for the font
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: "400", // Odibee Sans only has 400 weight available
  variable: "--font-nunito-sans", // Set a CSS variable for the font
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const outfit = Outfit({
  subsets: ["latin"],
  weight: "400", // Odibee Sans only has 400 weight available
  variable: "--font-outfit", // Set a CSS variable for the font",
});

export const metadata: Metadata = {
  title: "BattleBoard",
  description: "Your ultimate scoreboard for competitive gaming",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${odibeeSans.variable} ${nunitoSans.variable} ${geistMono.variable} ${outfit.variable} antialiased`}
      >
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <div className="flex flex-col min-h-screen">
              <SessionProvider>
                <Header />
                {children}
              </SessionProvider>
            </div>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

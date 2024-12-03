import type { Metadata } from "next";
import { Odibee_Sans } from "next/font/google";
import localFont from "next/font/local";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import Header from "./components/Header";

const odibeeSans = Odibee_Sans({
  subsets: ["latin"],
  weight: "400", // Odibee Sans only has 400 weight available
  variable: "--font-odibee-sans", // Set a CSS variable for the font
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

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${odibeeSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-col min-h-screen">
          <Header />


          <SessionProvider>{children}</SessionProvider>
        </div>
      </body >
    </html >
  );
}

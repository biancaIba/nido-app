import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter, DM_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";

import "@/app/globals.css";
import { AppLayout } from "@/components/app-layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nido",
  description: "", // TODO: add description
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${dmMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <AppLayout>{children}</AppLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}

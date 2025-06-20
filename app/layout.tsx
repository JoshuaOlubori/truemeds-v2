import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google"
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import {
  ClerkProvider
} from '@clerk/nextjs'
import { Toaster } from "@/components/ui/sonner"
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "TrueMeds",
  description: "AI-Powered Drug Verification",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
     <body className={`${inter.variable} font-sans`}>
     <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  </ClerkProvider>
  );
}

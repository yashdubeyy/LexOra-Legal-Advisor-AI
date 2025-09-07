import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Image from "next/image";

import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import Navbar from "./components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LexOra | AI-powered legal advisor for Indian Law",
  description: "An intelligent legal assistant that analyzes cases, finds relevant IPC sections, searches for legal precedents, and drafts professional documents",
  icons: {
    icon: [
      { url: '/logo.svg' },
    ],
    apple: [
      { url: '/logo.svg' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
      >
        <ThemeProvider>
          <div className="relative min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <footer className="border-t py-8 bg-background">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  {/* Logo and Description */}
                  <div className="flex items-center mb-6 md:mb-0">
                    <div className="relative w-8 h-8 mr-2.5">
                      <Image 
                        src="/logo.svg"
                        alt="LexOra Logo" 
                        width={32}
                        height={32}
                        className="w-full h-full"
                        priority
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="bg-gradient-to-r from-blue-600 to-indigo-800 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-600 font-bold text-lg leading-tight">
                        LexOra
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-300 font-medium tracking-wide">
                        Legal Advisor AI
                      </span>
                    </div>
                  </div>
                  
                  {/* Quick Links */}
                  <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-6 md:mb-0 text-sm text-gray-600 dark:text-gray-400">
                    <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group">
                      Home
                      <span className="absolute left-0 bottom-0 h-0.5 bg-blue-600 dark:bg-blue-400 w-0 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                    <Link href="/articles" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group">
                      Articles
                      <span className="absolute left-0 bottom-0 h-0.5 bg-blue-600 dark:bg-blue-400 w-0 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                    <Link href="/assistant" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group">
                      Legal Assistant
                      <span className="absolute left-0 bottom-0 h-0.5 bg-blue-600 dark:bg-blue-400 w-0 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                    <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group">
                      About Us
                      <span className="absolute left-0 bottom-0 h-0.5 bg-blue-600 dark:bg-blue-400 w-0 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </div>
                  
                  {/* Copyright */}
                  <div className="text-sm text-center md:text-right text-gray-500 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} LexOra. All rights reserved.
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
